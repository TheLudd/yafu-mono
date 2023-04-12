import { createRollupConfig } from '@yafu/create-rollup-config'

export default createRollupConfig('./identity.ts', import.meta.url, { curry: false })
