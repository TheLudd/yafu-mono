import { assert } from 'chai'
import { take } from '..'
import runIteratorTransduce from '../lib/run-iterator-transduce'
import { mapInc } from './utils'
import '../lib/array'

const { deepEqual } = assert
function createFibbonaciIterator (maxRounds = Infinity) {
  const previousValues = [ 0, 0 ]
  let rounds = 0
  return {
    next () {
      if (++rounds > maxRounds) return { value: undefined, done: true }

      const value = Math.max(1, previousValues[0] + previousValues[1])
      previousValues.shift()
      previousValues.push(value)
      return { value, done: false }
    },
  }
}

describe('runIteratorTransduce', () => {
  it('can stop early', () => {
    const result = runIteratorTransduce(take(5)([]), [], createFibbonaciIterator())
    const expected = [ 1, 1, 2, 3, 5 ]
    deepEqual(result, expected)
  })

  it('handles iterators that finish', () => {
    const result = runIteratorTransduce(mapInc([]), [], createFibbonaciIterator(8))
    const expected = [ 2, 2, 3, 4, 6, 9, 14, 22 ]
    deepEqual(result, expected)
  })

  it('handles empty iterators', () => {
    const result = runIteratorTransduce(mapInc([]), [], createFibbonaciIterator(0))
    const expected = []
    deepEqual(result, expected)
  })
})
