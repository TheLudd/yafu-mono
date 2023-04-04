import { assert } from 'chai'
import {
  equals,
  concat,
  chain,
  map,
  ap,
  reduce,
  traverse,
} from '@yafu/fantasy-functions'
import { Identity, identityOf } from '@yafu/fantasy-types'
import polyfill from '../lib/polyfill.js'

polyfill()

const { deepEqual, isTrue, isFalse } = assert

const inc = (x: number) => x + 1
const dec = (x: number) => x - 1
const oneTwo = [1, 2]

describe('setoid', () => {
  it('returns true for cases that are equal', () => {
    isTrue(equals([], []))
    isTrue(equals([1], [1]))
    isTrue(equals(['a', 'b', 'c'], ['a', 'b', 'c']))
  })

  it('returns false for cases that are not equal', () => {
    isFalse(equals([1], []))
    isFalse(equals([], [1]))
    isFalse(equals(['a', 'b', 'c'], ['b', 'b', 'c']))
  })
})

describe('semigroup', () => {
  function assertConcat<T>(a: T[], b: T[], expected: T[]) {
    const result = concat(a, b)
    deepEqual(result, expected)
  }

  it('concats arrays', () => {
    assertConcat(['a'], ['b'], ['b', 'a'])
    assertConcat(['b'], ['a'], ['a', 'b'])
  })

  it('concats empty arrays', () => {
    assertConcat([], ['b'], ['b'])
    assertConcat(['a'], [], ['a'])
    assertConcat([], [], [])
  })
})

describe('functor', () => {
  it('applies the function to all elements', () => {
    const result = map(inc, oneTwo)
    deepEqual(result, [2, 3])
  })

  it('handles empty arrays', () => {
    const result = map(inc, [])
    deepEqual(result, [])
  })
})

describe('apply', () => {
  const apps = [inc, dec]
  it('applies all functions to all elements', () => {
    const result = ap(apps, oneTwo)
    deepEqual(result, [2, 3, 0, 1])
  })
})

describe('chain', () => {
  const incAndDec = (x: number) => [inc(x), dec(x)]
  it('returns an aray containing all elements returned from all calls', () => {
    const result = chain(incAndDec, oneTwo)
    deepEqual(result, [2, 0, 3, 1])
  })
})

describe('reduce', () => {
  const add = (a: number, b: number) => a + b
  it('reduces the array', () => {
    const result = reduce(add, 10, oneTwo)
    deepEqual(result, 13)
  })
})

describe('traverse', () => {
  const identityPlusOne = (x: number) => identityOf(inc(x))
  it('traverses the array', () => {
    const result = traverse(Identity, identityPlusOne, oneTwo)
    const expected = identityOf([2, 3])
    deepEqual(result, expected)
  })
})
