# Development Workflow

This page covers how to *behave* while working on a package — the disciplines that apply to every change, no matter which SDK constructs you touch. The rest of the guide describes *what* to build; this page describes *how* to work while building it. These rules are the canonical home for the working discipline an AI coding agent should follow on every task.

## Keep README and instructions in sync

`README.md` and `instructions.md` are part of the package, not afterthoughts. Any change that affects user-visible behavior — a new or renamed action, an added or removed volume/port/interface/dependency, a changed default, a new feature or limitation — must update both files in the same change.

Apply this loop on every task:

1. Make the code change.
2. Open `README.md` and `instructions.md`. Read what each says about the area you touched.
3. If either no longer matches the code, update it in the same change.
4. If a file is silent on the area and doesn't need to speak to it, leave it.

Don't skip step 2 on the theory that a change was "internal." If you're unsure whether a change was user-visible, the doc check *is* the answer: if neither file mentions the area, it was internal; if one does, your change probably affects that file.

See [Writing READMEs](./writing-readmes.md) and [Writing Instructions](./writing-instructions.md) for the content rules.

## Iterate with a dirty working tree

`start-cli s9pk pack` appends a `-modified` suffix to the version hash when the working tree is dirty. This is **purely informational** — the `.s9pk` works exactly the same. Do not commit between test attempts just to get a clean hash.

- Leave the tree dirty while iterating.
- When the package works end-to-end, make **one** clean commit — not a trail of `fix: X`, `fix: Y`, `fix: Z` fixup commits.
- If you've already accumulated fixups during a debug session, `git reset --soft HEAD~N` collapses them so you can recommit as one.

## Pre-existing errors are still errors

If `tsc`, a test, or the pack step fails — even on something unrelated to your change — the package does not pass. "Pre-existing" is not a pass condition; it is a signal that nobody has fixed the problem yet. Either fix it, or stop and flag it explicitly. Never report a run as green when any check was red.

## Don't create unnecessary version files

Most version bumps edit `startos/versions/current.ts` in place — change the `version` and `releaseNotes`, leave `index.ts` and the filename alone. A new file is only spun off when the bump carries a migration. See [Versions — When to Create a New Version File](./versions.md#when-to-create-a-new-version-file) for the rule, and [Release Notes](./versions.md#release-notes) for how to write the notes that accompany a bump.
