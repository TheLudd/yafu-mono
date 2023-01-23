import resolve from '@rollup/plugin-node-resolve'
import { createRollupConfig } from '@yafu/create-rollup-config'

export default createRollupConfig('./lib/sort-dependencies.js', import.meta.url, resolve())
