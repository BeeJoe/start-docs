# Notifications

Notifications are messages your service can post to the StartOS notifications panel — the same panel where StartOS shows backup-completion notices, install failures, and similar OS-generated events. Use them to surface information that the user should see eventually but doesn't have to act on immediately: sync milestones, post-update changelogs, recoverable error details, etc. If you need the user to *do* something, use a [Task](./tasks.md) instead.

The host attributes every notification to the calling service automatically — a package cannot post notifications on behalf of another package.

## Plain Notification

Omit `data` for a notification with no extra payload. The notifications panel shows the `title` and `message` directly in the row.

```typescript
await sdk.notification.create(effects, {
  level: 'info',
  title: 'Sync Complete',
  message: 'Initial block download finished.',
})
```

## Notification With Markdown Details

Pass `data` as markdown text when the notification carries long-form content that doesn't belong inline. The panel still shows `title` and `message` in the row, and a "View Details" button opens `data` rendered as markdown in a large modal. Typical uses: post-update release notes, structured error reports, command output the user might want to copy.

`data` should be markdown text — not a short status string.

```typescript
await sdk.notification.create(effects, {
  level: 'success',
  title: 'Update Complete',
  message: 'Hello World was updated to 2.0.0. Tap for release notes.',
  data: [
    "## What's new in 2.0.0",
    '',
    '- Faster sync on slow networks',
    '- New `--verbose` flag for the daemon',
    '- Fixed a crash on startup when the data volume was empty',
    '',
    'See the full changelog at https://example.com/changelog.',
  ].join('\n'),
})
```

## Parameters

| Parameter | Type                                          | Description                                                                                       |
| --------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `effects` | `Effects`                                     | Provided by the calling context                                                                   |
| `level`   | `'success' \| 'info' \| 'warning' \| 'error'` | Severity, controls the icon and color in the panel                                                |
| `title`   | `string`                                      | Short headline shown in the row                                                                   |
| `message` | `string`                                      | One-line body shown in the row beneath the title                                                  |
| `data`    | `string \| null` (optional)                   | Optional markdown body rendered in the "View Details" modal. Omit for a plain (panel-row-only) notification |

## Common Patterns

### Notify on Sync Completion

Post a one-time success notification from a daemon's health check or main flow when long-running work finishes:

```typescript
await sdk.notification.create(effects, {
  level: 'success',
  title: i18n('Sync Complete'),
  message: i18n('Bitcoin Core has finished initial block download.'),
})
```

### Surface Release Notes After an Update

In your `setupOnInit` (or a version migration), post a notification with markdown `data` when the previous version is non-null so the user gets the changelog the next time they open the panel:

```typescript
export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'update') return

  await sdk.notification.create(effects, {
    level: 'info',
    title: i18n('Hello World Updated'),
    message: i18n('See what changed in this version.'),
    data: await fs.readFile('/usr/lib/startos/package/CHANGELOG.md', 'utf8'),
  })
})
```

### Report a Recoverable Error With Details

Pair a short `message` with full diagnostic output in `data` so the user gets context without dumping a wall of text into the panel row:

```typescript
await sdk.notification.create(effects, {
  level: 'warning',
  title: i18n('Backup Skipped'),
  message: i18n('A non-critical backup step was skipped. Tap for details.'),
  data: [
    '## Skipped: optional thumbnail cache',
    '',
    '`/data/cache/thumbnails` was not present, so it was skipped during this backup.',
    'No data was lost — the cache will be regenerated on next use.',
    '',
    '```',
    err.stack ?? String(err),
    '```',
  ].join('\n'),
})
```

> [!NOTE]
> Notifications are not idempotent — every call creates a new entry. If a daemon's health loop calls `sdk.notification.create()` on every poll, the panel will fill up. Gate on a one-shot condition (a flag in your store, a state transition, etc.) so you only post when something actually changed.
