import { assert } from 'chai'
import { map, into } from '../../index.js'

const { deepEqual } = assert

function inc (x) {
  return x + 1
}

it('map', () => {
  const list = [ 1, 2, 3 ]
  const result = into(
    [],
    map(inc),
    list,
  )
  deepEqual(result, [ 2, 3, 4 ])
})
