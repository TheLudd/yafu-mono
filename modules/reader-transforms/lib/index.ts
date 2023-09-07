import { eitherOf } from '@yafu/either'
import { ioOf } from '@yafu/io'
import { parallelOf } from '@yafu/parallel'
import { RIO } from './rio.js'
import { RTE } from './rte.js'
import { RTF } from './rtf.js'

export * from './rio.js'
export * from './rte.js'
export * from './rtf.js'
export * from './run.js'

export * from './rtf-functions.js'

export const rioOf = <T>(value: T) => new RIO(() => ioOf(value))
export const rteOf = <T>(value: T) => new RTE(() => eitherOf(value))
export const rtfOf = <T>(value: T) => new RTF(() => parallelOf(value))
