import { camelCase } from 'camel-case'
import runTests from './run-tests.js'

import * as bundle from '../dist/index.js'

function upperFirst (string) {
  return string[0].toUpperCase() + string.substring(1)
}

function getBundleFunction (b) {
  return (name) => {
    const camelCaseName = camelCase(name)
    return b[camelCaseName] || b[upperFirst(camelCaseName)]
  }
}

describe('yafu bundle', runTests(getBundleFunction(bundle), true))
