import { createRollupConfig } from '@yafu/create-rollup-config'

export default createRollupConfig('./lib/polyfill.js', import.meta.url)
