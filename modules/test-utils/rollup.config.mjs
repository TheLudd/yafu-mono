import { createRollupConfig } from '@yafu/create-rollup-config'

export default createRollupConfig('./lib/index.js', import.meta.url, { curry: false, skipTypes: true })
