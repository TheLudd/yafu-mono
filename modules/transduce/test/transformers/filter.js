import { assert } from 'chai'
import { filter, into } from '../../index.js'

const { deepEqual } = assert

const isOdd = (n) => n % 2 === 1

it('filter', () => {
  const list = [ 1, 2, 3 ]
  const result = into(
    [],
    filter(isOdd),
    list,
  )
  deepEqual([ 1, 3 ], result)
})
