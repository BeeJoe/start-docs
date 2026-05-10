# Writing Service Instructions

`instructions.md` is a required file at the root of every StartOS package, alongside `README.md`. Its contents are packed into the s9pk archive and surfaced to the user under the **Instructions** tab on the service details page in StartOS, beneath the Dashboard.

Instructions are **for the human running the service** — not for developers, not for AI assistants. They should orient that person to what the service is, walk them through getting it usefully running on StartOS, and point them at upstream documentation when they need to go deeper.

## Instructions vs. README — they are not the same file

It is tempting to treat `instructions.md` as a copy of the README. Resist this. The two files serve different audiences and answer different questions.

| | README | instructions.md |
|---|---|---|
| **Audience** | Developers, AI assistants, contributors | End users running the service on StartOS |
| **Question it answers** | "How does this package work, and how does it differ from running the upstream service directly?" | "I just installed this. What is it, and how do I actually use it?" |
| **Tone** | Technical, structured, scannable for parsing | Practical, instructional, written in second person |
| **Versions / image tags** | Avoided (manifest is source of truth) | Avoided for the same reason |
| **Upstream behavior** | "Anything not listed here behaves as upstream documents" | Linked to at the bottom; never duplicated |
| **Surfaced where** | The package repository on GitHub | Inside the StartOS UI, post-install |

If your README is a reference manual, your instructions are a quick-start guide for a non-developer who just clicked Install.

## What belongs in instructions

A good `instructions.md` covers, roughly in this order:

1. **What this service is** — one or two sentences. Assume the reader has heard of it but may not know exactly what it does. Link the project's home page or a recognizable description in the upstream docs.

2. **What it gives you on StartOS** — the practical answer to "why did I just install this?" Keep it concrete: the interfaces it exposes, the data it manages, the experience the StartOS package adds on top of upstream.

3. **Getting set up** — the smallest sequence of steps that takes a fresh install to a usable state. Use numbered lists. Reference real action names, real interfaces, and real screens that exist in the StartOS UI for this service. If setup requires a dependency, say so plainly: "Install Bitcoin Core first" rather than "satisfy the dependency."

4. **Using the available features** — once the service is running, what can the user actually do with it? Describe the interfaces (web UI, RPC, etc.), the actions available from the StartOS sidebar, and any first-time tasks they will see prompted by the package.

5. **Important limitations** — anything that will surprise the user. Things the upstream version does that this package does not. Features deliberately disabled. Restart-required settings. Performance constraints. Be honest; users prefer "this doesn't support X yet" over discovering it themselves.

6. **External links** — at the end. Upstream documentation, project home page, support channels, anything else the user might want when they outgrow these instructions. Link to canonical, stable URLs (the project's docs site, not a specific GitHub commit).

## What does not belong in instructions

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

```markdown
# [Service Name]

[One- or two-sentence description of what the service is. Link the project home or a recognizable upstream description.]

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

[How to reach it, what they will see first.]

### Actions

[Each StartOS action: what it does, when to run it.]

### [Other capability]

[…]

## Limitations

- [Anything that will surprise a user coming from upstream.]
- [Features deliberately disabled or not yet supported.]
- [Restart-required settings, performance caveats, etc.]

## Learn more

- [Project home](https://example.org)
- [Upstream documentation](https://docs.example.org)
- [Support / community](https://example.org/support)
```

## Pre-publish checklist

- [ ] File exists at `instructions.md` at the package root (the build will fail otherwise).
- [ ] Written for the user, not the developer — no internal SDK terminology.
- [ ] Setup steps walk a fresh install to a usable state.
- [ ] Every action and interface mentioned actually exists in the package.
- [ ] No hard-coded version numbers, image tags, or secrets.
- [ ] Limitations section is honest about what the package cannot do.
- [ ] Upstream links go to canonical, stable URLs.
- [ ] Renders cleanly in the StartOS Instructions tab on a real install.
