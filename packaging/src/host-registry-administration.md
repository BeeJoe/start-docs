# Administration

Day-to-day registry administration happens through `start-cli registry` from an admin's workstation. This page walks through the common tasks; for full command syntax see the [start-cli registry reference](/start-os/cli-reference.html#registry).

All commands below assume your `start-cli` is pointed at your registry — either via `--registry <url>` on each invocation or via `registry-url` in `~/.startos/config.yaml`. See [Setup](host-registry-setup.md) if you haven't configured that yet.

## Signers

A **signer** is a public key authorized to publish a specific package, OS version, or asset. Admins are themselves signers — when you added the first admin, you registered a signer identity with admin privileges.

Register a new signer (without admin rights):

```sh
start-cli registry admin signer add \
  --name "Alice" \
  --contact "alice@example.com" \
  --key "$(cat alice.pub.pem)"
```

The registry returns the signer's ID. Use that ID with `start-cli registry admin signer edit` to update contact info or keys, or `start-cli registry admin signer list` to see everyone registered.

To grant a signer admin privileges (or revoke them), use `start-cli registry admin add <SIGNER_ID>` / `... admin remove <SIGNER_ID>`.

## Packages

### Authorizing a signer for a package

Before a non-admin signer can publish a package, an admin (or an already-authorized signer for the same package) must scope them to it:

```sh
start-cli registry package signer add <PACKAGE_ID> <SIGNER_ID> \
  --versions ">=1.0.0"
```

`--versions` is a version range — Alice can publish any version in the range you grant her. Admins can publish any package at any version without an explicit scope.

### Publishing a package

From the directory containing the `.s9pk`:

```sh
start-cli s9pk publish \
  --url https://my-registry.example.com \
  myservice_1.2.0_x86_64.s9pk
```

`publish` signs the `.s9pk` with the local developer key, uploads it to the registry, and registers it in the index. If your registry already has the same `(package id, version, sighash)` indexed, the upload is a no-op except for any new signatures merging in.

### Removing a package

Remove a specific version:

```sh
start-cli registry package remove <PACKAGE_ID> <VERSION>
```

Remove an entire package (all versions):

```sh
start-cli registry package remove <PACKAGE_ID>
```

The second form refuses to run if the package has versions, unless you pass `--force`.

### Mirrors

A mirror is an alternate download URL for the same `.s9pk`. The registry indexes mirrors per-version; downloads try mirrors in order until one succeeds.

```sh
start-cli registry package add-mirror <S9PK_FILE> <MIRROR_URL>
start-cli registry package remove-mirror <PACKAGE_ID> <VERSION> --url <MIRROR_URL>
```

You can't remove the last remaining URL for a package — every indexed version needs at least one reachable URL.

## Categories

Categories are flat tags that group packages in the marketplace UI. Create and assign:

```sh
start-cli registry package category add bitcoin "Bitcoin"
start-cli registry package category add-package bitcoin <PACKAGE_ID>
```

A package can be in multiple categories. `start-cli registry package category list` enumerates them.

## StartOS versions

If your registry distributes StartOS images (not just service packages), register each release so devices can find upgrade paths:

```sh
start-cli registry os version add \
  <VERSION> \
  <HEADLINE> \
  <RELEASE_NOTES> \
  <SOURCE_VERSION_RANGE>
```

`<SOURCE_VERSION_RANGE>` is a version range describing which prior OS versions can upgrade to this one. After registering the version, upload the install images:

```sh
start-cli registry os asset add <FILE> <URL> \
  --platform x86_64 --version <VERSION>
```

Repeat per platform (`x86_64`, `aarch64`, `riscv64`) and per asset type (`img`, `iso`, `squashfs`).

## Webhooks

The registry can POST a signed HTTP event to every configured subscriber every time its index changes — a package is published, a version removed, a StartOS release registered. Each event is signed with an Ed25519 keypair the registry generates on first boot; the registry's public key is its identity. Consumers maintain an allowlist of trusted public keys — no shared secret is needed. Add as many subscribers as you like (an announcer, a mirror, a dashboard); each receives every event and is responsible for its own downstream fan-out (Matrix, X/nostr, …).

If no subscribers are configured, no events are persisted and nothing is sent — the system is fully inert until you add one.

### Configuration

Subscribers are managed at runtime — there is no config-file webhook setting. Add, remove, and list them with `start-cli`:

```sh
start-cli registry webhook subscriber add https://my-announcer.example.com/registry-events
start-cli registry webhook subscriber add https://mirror.example.org/hooks
start-cli registry webhook subscriber list
start-cli registry webhook subscriber remove https://mirror.example.org/hooks
```

The URL must be `http` or `https`; `add`/`remove` are idempotent and persisted in the registry database, taking effect on the next event without a restart. There is no secret and no operator-chosen id — the registry's identity is its public key, generated on first start and persisted in the registry database.

Publish the registry's public key to each consumer with:

```sh
start-cli registry webhook pubkey
```

The output is a base64-encoded Ed25519 SPKI DER (~60 chars on a single line) — the same form sent in the `x-startos-registry-pubkey` header on every webhook delivery. The consumer's operator adds it to their allowlist of trusted registries. One consumer can accept events from many registries by holding multiple pubkeys in its allowlist; the registry that signed a given request identifies itself in the `x-startos-registry-pubkey` header.

### Wire format

Each event is a `POST` with a JSON body and four custom headers:

| Header | Value |
| --- | --- |
| `x-startos-registry-pubkey` | base64-encoded Ed25519 SPKI DER (44 bytes → ~60 chars) — read this and look it up in your allowlist before verifying |
| `x-startos-registry-signature` | base64 of the 64-byte Ed25519 signature over the raw body |
| `x-startos-registry-topic` | event topic (e.g. `package.version.add`) |
| `x-startos-registry-event-id` | event ID, stable across replays — dedupe on this |

Body envelope (same shape for every topic):

```json
{
  "id": "<event-id>",
  "topic": "package.version.add",
  "occurredAt": "2026-05-19T18:22:01Z",
  "data": { /* topic-specific */ }
}
```

Consumer flow: read the pubkey header → reject if not in the allowlist → verify the signature against the raw body using that pubkey → dedupe on `event-id`. The same `event-id` arrives on every replay.

### Topics

| Topic | Fires on | `data` highlights |
| --- | --- | --- |
| `package.version.add` | A package version is added or updated | `packageId`, `version`, `isFirstVersion`, `isUpdate`, `urls`, full `metadata` (title, description, releaseNotes, repos, donationUrl, …) |
| `package.remove` | A package or a specific version is removed | `packageId`, `version` (null if entire package), `sighash` (null unless targeted) |
| `os.version.add` | A StartOS release is registered or updated | `version`, `headline`, `releaseNotes`, `sourceVersion`, `isUpdate` |
| `os.version.remove` | A StartOS release is removed | `version` |

`isFirstVersion` distinguishes "new package" from "package updated"; `isUpdate` distinguishes a brand-new version from a merge into an existing one (e.g. adding a mirror URL).

### Delivery semantics

The registry fans out to every subscriber — one delivery attempt each, with no automatic retry. Every event and every delivery attempt (target subscriber, timestamp, HTTP status, error, duration) is persisted in the registry database for inspection and replay.

```sh
start-cli registry webhook list --limit 20
start-cli registry webhook list --topic package.version.add --since 2026-05-01T00:00:00Z
start-cli registry webhook replay <EVENT_ID>
```

Replay re-delivers to every current subscriber and reuses the original `event-id`, so a consumer that dedupes on it will treat the replay as an idempotent retry of the original — not a force-re-announce. Subscribers that already received the event ignore the repeat; one that was added or recovered after the fact picks it up. If you need to re-announce, clear the dedup record on the consumer side.

## Inspecting the registry

```sh
start-cli registry index            # registry metadata + every package
start-cli registry package index    # packages and categories only
start-cli registry os index         # OS versions
start-cli registry admin list       # admins
start-cli registry admin signer list  # all signers
```

All listing commands accept `--format json` for machine-readable output.

## Low-level database access

For debugging or scripted recovery, you can read and patch the registry's patch-db directly:

```sh
start-cli registry db dump -p /index/package/packages
start-cli registry db apply '<jq-style expression>'
```

These are powerful and easy to misuse — there's no schema validation on `apply`. Prefer the higher-level commands above unless you're recovering from a bug.
