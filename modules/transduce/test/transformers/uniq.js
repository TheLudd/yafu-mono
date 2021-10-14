import { assert } from 'chai'
import { uniq, into } from '../../index.js'

const { deepEqual } = assert

function runTest () {
  const list = [
    'Foo',
    'FOO',
    'Foo',
    'bar',
    'BAr',
    'baR',
  ]
  const result = into(
    [],
    uniq,
    list,
  )
  deepEqual(result, [ 'Foo', 'FOO', 'bar', 'BAr', 'baR' ])
}

describe('uniq', runTest)
describe('uniq - does not leak', runTest)
