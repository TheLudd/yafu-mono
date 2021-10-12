import { assert } from 'chai'
import drop from '../../lib/transformers/drop.js'
import into from '../../lib/into.js'

const { deepEqual } = assert

it('drop', () => {
  const list = [ 1, 2, 3, 4, 5, 6 ]
  const result = into(
    [],
    drop(2),
    list,
  )
  deepEqual([ 3, 4, 5, 6 ], result)
})
