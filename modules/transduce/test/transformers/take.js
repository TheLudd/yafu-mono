import { assert } from 'chai'
import { take, into } from '../../index.js'

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
