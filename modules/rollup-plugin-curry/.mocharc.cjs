const baseConfig = require('../../.mocharc')
const config = {
  ...baseConfig,
  require: 'ts-node/register',
  extension: [ 'ts', 'js', 'mjs' ],
  require: "ts-node/register",
  loader: "ts-node/esm",
}

module.exports = config
