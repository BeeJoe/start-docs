# Writing Service Instructions

`instructions.md` is a required file at the root of every StartOS package, alongside `README.md`. Its contents are packed into the s9pk archive and surfaced to the user under the **Instructions** tab on the service details page in StartOS, beneath the Dashboard.

Instructions are **for the human running the service** — not for developers, not for AI assistants. They pick up where the marketplace listing left off: by the time someone reads this tab they have seen the short and long description and clicked Install, so don't reintroduce the service. Orient them to what it does *on StartOS*, walk them through getting it usefully running, and point them at upstream documentation when they need to go deeper.

## Instructions vs. README — they are not the same file

It is tempting to treat `instructions.md` as a copy of the README. Resist this. The two files serve different audiences and answer different questions.

| | README | instructions.md |
|---|---|---|
| **Audience** | Developers, AI assistants, contributors | End users running the service on StartOS |
| **Question it answers** | "How does this package work, and how does it differ from running the upstream service directly?" | "I just installed this — now what? How do I use it on StartOS?" |
| **Tone** | Technical, structured, scannable for parsing | Practical, instructional, written in second person |
| **Versions / image tags** | Avoided (manifest is source of truth) | Avoided for the same reason |
| **Upstream behavior** | "Anything not listed here behaves as upstream documents" | Linked from the Documentation section; never duplicated |
| **Surfaced where** | The package repository on GitHub | Inside the StartOS UI, post-install |

If your README is a reference manual, your instructions are a quick-start guide for a non-developer who just clicked Install.

## What belongs in instructions

A good `instructions.md` covers, roughly in this order:

1. **A brief orientation — optional.** The reader already saw the marketplace short and long description before clicking Install, so don't restate them. A one-line "you've installed X — here's how to use it on StartOS" framing is fine; so is genuinely new context the listing didn't cover. If there's nothing to add, skip straight to the next section. Don't pad.

2. **Documentation links.** A `## Documentation` section with a link to the upstream documentation — a few words on what each one is ("the upstream README", "the official Foo configuration reference") — plus the project home page, support channels, and anything else the user might want when they outgrow these instructions. Put it near the top, right after the orientation: "where do I read more?" is often the highest-value thing on the page. (A longer instructions file can keep it at the end instead.) Link to canonical, stable URLs — the project's docs site or its `master` README, not a specific commit.

3. **What it gives you on StartOS** — the practical answer to "why did I just install this?" Keep it concrete: the interfaces it exposes, the data it manages, the experience the StartOS package adds on top of upstream.

4. **Getting set up** — the smallest sequence of steps that takes a fresh install to a usable state. The reader has already installed the service — don't include download or install steps. Start from first launch. Use numbered lists. Reference real action names, real interfaces, and real screens that exist in the StartOS UI for this service. If setup requires a dependency, say so plainly: "Install Bitcoin Core first" rather than "satisfy the dependency."

5. **Using the available features** — once the service is running, what can the user actually do with it? Describe the interfaces (web UI, RPC, etc.), the actions available from the StartOS sidebar, and any first-time tasks they will see prompted by the package.

6. **Important limitations** — anything that will surprise the user. Things the upstream version does that this package does not. Features deliberately disabled. Restart-required settings. Performance constraints. Be honest; users prefer "this doesn't support X yet" over discovering it themselves.

> [!NOTE]
> Older StartOS manifests carried a `docsUrls` array for upstream documentation links. That field has been removed — those links belong in the `## Documentation` section of this file now, where you can give each one the context a bare URL in the manifest never had.

## What does not belong in instructions

- **A restatement of the marketplace description.** The reader saw the short and long description before installing — opening with "Foo is a self-hosted bar" wastes their time. Start from "now what."
- **Install or download steps.** They've already installed the service; that's why they're on this tab. Begin at first launch.
- **How StartOS itself works.** The interface panel's copy-address / QR-code / LAN-Tor-domain controls, the Dashboard and Instructions tabs, how backups and updates work, how to start or stop a service — these are platform features a user learns once, not per-package. Mention only what's specific to *this* service: which interfaces it exposes and what each is for, which actions it adds and when to run them. Naming a screen to send the user to ("open it from the **Dashboard** tab") is fine; explaining what that screen is, isn't.
- **The full configuration reference.** Link to upstream for that.
- **Version numbers and image tags.** They go stale every release; the manifest is the source of truth.
- **Architectural detail about how the package is built.** That is the README's job.
- **Reasons the package was structured a particular way.** Users do not care.
- **Internal terminology from the StartOS codebase** ("ABI", "task", "manifest", "subcontainer"). Use the words a user sees in the UI.
- **Secrets, default passwords, or API keys hard-coded into the markdown.** Generate those at install time and surface them via actions.

## Style

- Write in the second person. "You will see…", "When you click…", "Before you start, make sure…".
- Prefer numbered lists for any multi-step procedure.
- Use code blocks for commands the user might run, hostnames they might paste, or RPC calls — not for prose.
- Keep paragraphs short. Many users will scan, not read.
- Use H2 (`##`) for top-level sections; reserve H1 for the service name at the top of the file.
- StartOS will render the markdown through the same pipeline as release notes and licenses, so standard CommonMark + GFM tables work; exotic HTML may not.

## Suggested structure

Use the sections that apply — a trivial service might be two paragraphs and a Documentation list; a complex one might need every section below and more. Don't include a section just to have it (if the service has no actions, you usually needn't say so).

```markdown
# [Service Name]

[Optional. One or two sentences only if you have something to add beyond the marketplace short/long description the reader already saw — or a one-line "you've installed X; here's how to use it on StartOS" framing. Otherwise delete this line and start with the section below.]

## Documentation

- [Upstream documentation](https://docs.example.org) — what it is in a few words (the config reference, the upstream README, etc.).
- [Project home](https://example.org)
- [Support / community](https://example.org/support)

## What you get on StartOS

[Concrete description of the StartOS experience: which interfaces are exposed, what data it manages, what the package adds on top of upstream.]

## Getting set up

1. [First concrete step the user should take after install.]
2. [Second step…]
3. [Until the service is in a usable state.]

> If your service depends on another, list the dependency explicitly here and tell the user to install it first.

## Using [Service Name]

[Describe the day-to-day experience. Interfaces, actions, common workflows. One short subsection per major capability is fine.]

### Web interface

[What this interface is for and what the user sees first — a login screen, a setup wizard, an empty dashboard. Not how the universal interface-panel controls work; those are identical in every service.]

### Actions

[Each StartOS action: what it does, when to run it.]

### [Other capability]

[…]

## Limitations

- [Anything that will surprise a user coming from upstream.]
- [Features deliberately disabled or not yet supported.]
- [Restart-required settings, performance caveats, etc.]
```

## Pre-publish checklist

- [ ] File exists at `instructions.md` at the package root (the build will fail otherwise).
- [ ] Written for the user, not the developer — no internal SDK terminology.
- [ ] Does not restate the marketplace short/long description, contains no install or download steps, and doesn't explain StartOS platform features (interface controls, tabs, backups) the user already knows.
- [ ] Setup steps walk from first launch to a usable state.
- [ ] Every action and interface mentioned actually exists in the package.
- [ ] No hard-coded version numbers, image tags, or secrets.
- [ ] Limitations section is honest about what the package cannot do.
- [ ] A `## Documentation` section links the upstream docs (with a few words on what each is) and any other canonical, stable URLs.
- [ ] Renders cleanly in the StartOS Instructions tab on a real install.
