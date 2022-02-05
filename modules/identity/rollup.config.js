import pkg from './package.json'
// eslint-disable-next-line
import createRollupConfig from '../../create-rollup-config.js'

export default createRollupConfig('./identity.ts', pkg)
