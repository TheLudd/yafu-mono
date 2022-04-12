import { Identity } from '@yafu/fantasy-types'
import { readerT } from '../lib/reader-t.ts'

export const RI = readerT(Identity)
