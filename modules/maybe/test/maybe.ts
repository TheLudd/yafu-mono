import { assert } from 'chai'
import { ap, chain, equals, map, reduce } from '@yafu/fantasy-functions'
import { maybeOf, nothing } from '../lib/maybe.js'

const inc = (a: number) => a + 1

const m1 = maybeOf(1)

const { isTrue, isFalse, deepEqual, equal } = assert

describe('setoid', () => {
  it('returns true if values are equal', () => {
    isTrue(equals(maybeOf(1), m1))
  })

  it('returns false if values are non equal', () => {
    isFalse(equals(maybeOf(2), m1))
  })

  it('returns false if other param is not of the same type', () => {
    isFalse(equals({ v: 1 }, m1))
  })

  it('returns false when comparing a just to a nothing', () => {
    isFalse(equals(nothing, m1))
    isFalse(equals(m1, nothing))
  })

  it('returns true if both values are nothing', () => {
    isTrue(equals(nothing, nothing))
  })
})

describe('functor', () => {
  it('applies the function to the encapsulated value', () => {
    deepEqual(map(inc, m1), maybeOf(2))
  })

  it('retuns nothing if the instance is nothing', () => {
    const m = map(inc, nothing)
    equal(m, nothing)
  })
})

describe('apply', () => {
  const maybeInc = maybeOf(inc)
  it('applies the function to the encapsulated value', () => {
    deepEqual(ap(maybeInc, m1), maybeOf(2))
  })

  it('retuns nothing if the instance is nothing', () => {
    const m = ap(maybeInc, nothing)
    equal(m, nothing)
  })
})

describe('chain', () => {
  const incPositive = (v: number) => (v > 0 ? maybeOf(v + 1) : nothing)
  it('applies the function to the encapsulated value', () => {
    deepEqual(chain(incPositive, m1), maybeOf(2))
  })

  it('retuns nothing if the instance is nothing', () => {
    const m = chain(incPositive, nothing)
    equal(m, nothing)
  })

  it('can convert Just instances to nothing', () => {
    const m = chain(incPositive, maybeOf(-1))
    equal(m, nothing)
  })
})

describe('foldable', () => {
  const add = (a: number, b: number) => a + b
  it('folds the value with the seed using the accumulator', () => {
    equal(reduce(add, 10, maybeOf(2)), 12)
  })

  it('retuns the seed if the instance is nothing', () => {
    equal(reduce(add, 10, nothing), 10)
  })
})
