import { createRollupConfig } from '@yafu/create-rollup-config'
import pkg from './package.json'

export default createRollupConfig('./identity.ts', pkg)
