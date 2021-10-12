import { assert } from 'chai'
import into from '../lib/into.js'
import map from '../lib/transformers/map.js'

const { notEqual, deepEqual } = assert
const inc = (n) => n + 1
const transduceFn = map(inc)

describe('into', () => {
  it('works', () => {
    const intoMe = []
    const result = into(intoMe, transduceFn, [ 1, 2 ])
    deepEqual(result, [ 2, 3 ])
    notEqual(result, intoMe)
  })

  it('works', () => {
    const intoMe = [ 1 ]
    const result = into(intoMe, transduceFn, [ 1, 2 ])
    deepEqual(result, [ 1, 2, 3 ])
    notEqual(result, intoMe)
  })
})
