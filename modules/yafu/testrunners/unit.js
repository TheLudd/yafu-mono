import { camelCase } from 'camel-case'
import * as yafu from '../dist/index.js'
import runTests from './run-tests.js'

function getFunction (fileName) {
  const name = fileName.length === 1 ? fileName.toUpperCase() : camelCase(fileName)
  return yafu[name]
}

describe('yafu', runTests(getFunction))
