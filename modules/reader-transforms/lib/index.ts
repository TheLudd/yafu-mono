import { RIO } from './rio.js'
import { RTE } from './rte.js'
import { RTF } from './rtf.js'

export * from './rio.js'
export * from './rte.js'
export * from './rtf.js'
export * from './run.js'

export const rioOf = <T>(value: T) => RIO['fantasy-land/of'](value)
export const rteOf = <T>(value: T) => RTE['fantasy-land/of'](value)
export const rtfOf = <T>(value: T) => RTF['fantasy-land/of'](value)
