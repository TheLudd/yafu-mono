import { assert } from 'chai'
import { into } from '../index.js'
import { incEven } from './utils.js'
import '../lib/set.js'

const { notEqual, deepEqual } = assert

describe('set', () => {
  const sampleArray = [ 1, 0, 6, 3, 4, 0 ]

  it('adds to an empty set', () => {
    const set = new Set()
    const result = into(set, incEven, sampleArray)
    const expected = new Set([ 1, 7, 5 ])
    deepEqual(result, expected)
    notEqual(result, set)
  })

  it('adds to a non empty set', () => {
    const set = new Set([ 1, 2, 10 ])
    const result = into(set, incEven, sampleArray)
    const expected = new Set([ 1, 7, 5, 2, 10 ])
    deepEqual(result, expected)
    notEqual(result, set)
  })

  it('can be transduced', () => {
    const set = new Set(sampleArray)
    const result = into([], incEven, set)
    const expected = [ 1, 7, 5 ]
    deepEqual(result, expected)
  })
})
