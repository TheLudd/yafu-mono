import { createRollupConfig } from '@yafu/create-rollup-config'

export default createRollupConfig('./lib/index.ts', import.meta.url, { curry: false })
