import { createRollupConfig } from '@yafu/create-rollup-config'

export default createRollupConfig('./lib/parallel.js', import.meta.url)
