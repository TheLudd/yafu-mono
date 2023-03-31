import { createRollupConfig } from '@yafu/create-rollup-config'

export default createRollupConfig('./lib/io.ts', import.meta.url, { curry: false })
