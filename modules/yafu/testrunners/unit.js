import runTests from './run-tests.js'

function getFunction (name) {
  var filePath = '../lib/' + name
  return require(filePath)
}

describe('yafu', runTests(getFunction))
