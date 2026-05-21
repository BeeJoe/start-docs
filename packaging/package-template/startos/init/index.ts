import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'

// This package defines no interfaces, so `setInterfaces` is omitted. When you
// add startos/interfaces.ts, import its `setInterfaces` and insert it here,
// conventionally before `setDependencies`.
export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setDependencies,
  actions,
)

export const uninit = sdk.setupUninit(versionGraph)
