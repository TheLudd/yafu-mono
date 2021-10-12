import { assert } from 'chai'
import uniqBy from '../../lib/transformers/uniq-by.js'
import into from '../../lib/into.js'

const { deepEqual } = assert

function toLower (s) {
  return s.toLowerCase()
}

describe('uniqBy', () => {
  const list = [
    'Foo',
    'FOO',
    'FoO',
    'bar',
    'BAr',
    'baR',
  ]
  const result = into(
    [],
    uniqBy(toLower),
    list,
  )
  deepEqual(result, [ 'Foo', 'bar' ])
})
