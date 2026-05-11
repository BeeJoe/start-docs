# Post a Notification to the User

Surface information to the user in the StartOS notifications panel — the same panel where StartOS shows backup-completion notices, install failures, and similar OS-generated events. Use this for things the user should see eventually but doesn't have to act on immediately: sync milestones, post-update release notes, recoverable error reports, command output worth keeping around. If you need the user to *do* something, use a [Task](tasks.md) instead.

## Solution

Call `sdk.notification.create(effects, options)` from any context that has `effects` (init, main, an action handler, a health-check body). `options` is `{ level, title, message, data? }`. Omit `data` for a plain panel entry; pass markdown text for `data` to attach a long-form body that the UI renders in a "View Details" modal — use this for release notes, structured error reports, or anything longer than a one-line message. The host attributes the notification to the calling service automatically; a package cannot post on behalf of another package.

Notifications are not idempotent — every call creates a new entry. Gate posts behind a one-shot condition (a state transition in your store, the `kind === 'update'` branch of `setupOnInit`, etc.) so a polling loop doesn't fill the panel.

**Reference:** [Notifications](notifications.md) · [Tasks](tasks.md) (when the user must act) · [Initialization](init.md) (post-update release notes)

## Examples

See the [Notifications](notifications.md) reference page for code samples covering the common patterns: one-shot success notice, post-update release notes via `setupOnInit`, and recoverable-error reports with markdown details.
