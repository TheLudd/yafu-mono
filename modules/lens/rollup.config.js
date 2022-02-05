import pkg from './package.json'
// eslint-disable-next-line import/no-relative-packages
import createRollupConfig from '../../create-rollup-config.js'

export default createRollupConfig('./index.ts', pkg)
