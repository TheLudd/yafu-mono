import { assert } from 'chai'
import take from '../../lib/transformers/take.js'
import into from '../../lib/into.js'

const { deepEqual } = assert

it('take', () => {
  const list = [ 1, 2, 3, 4, 5, 6 ]
  const result = into(
    [],
    take(3),
    list,
  )
  deepEqual([ 1, 2, 3 ], result)
})
