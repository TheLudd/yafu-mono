import { assert } from 'chai'
import { batch, into } from '../../index.js'

const { deepEqual } = assert

describe('batch', () => {
  it('batches element', () => {
    const list = [ 1, 2, 3, 4, 5, 6 ]
    const result = into(
      [],
      batch(2),
      list,
    )
    deepEqual([
      [ 1, 2 ],
      [ 3, 4 ],
      [ 5, 6 ],
    ], result)
  })

  it('flushes leftovers', () => {
    const list = [ 1, 2, 3, 4, 5 ]
    const result = into(
      [],
      batch(2),
      list,
    )
    deepEqual([
      [ 1, 2 ],
      [ 3, 4 ],
      [ 5 ],
    ], result)
  })
})
