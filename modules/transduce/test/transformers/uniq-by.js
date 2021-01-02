import { assert } from 'chai'
import uniqBy from '../../lib/transformers/uniq-by'
import into from '../../lib/into'

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
