const base = require('../../.mocharc.js')

module.exports = {
  ...base,
  require: '@babel/register'
}
