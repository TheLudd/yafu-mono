import { createRollupConfig } from '@yafu/create-rollup-config'

export default createRollupConfig('./lib/polyfill.ts', import.meta.url)
