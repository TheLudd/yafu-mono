import { assert } from 'chai'
import { of as OF } from 'fantasy-land'
import { ap, chain, equals, map, reduce } from '@yafu/fantasy-functions'
import {
  cata,
  Either,
  eitherOf,
  left,
  right
} from '../lib/either.js'

const {
  equal,
  isTrue,
  isFalse,
  deepEqual
} = assert
const e1 = eitherOf(1) as Either<number, number>
const l = left(1) as Either<number, number>

const inc = (x: number) => x + 1
const add = (x: number, y: number) => x + y

describe('setoid', () => {
  it('returns true for 2 equal lefts', () => {
    const e1b = eitherOf(1)
    isTrue(equals(e1, e1b))
  })

  it('returns false for 2 non equal lefts', () => {
    const e1b = eitherOf(2)
    isFalse(equals(e1, e1b))
  })

  it('returns true for 2 equal rights', () => {
    isTrue(equals(right(1), right(1)))
  })

  it('returns false for 2 non equal rights', () => {
    isFalse(equals(right(2), right(1)))
  })

  it('returns false for a left and a right with the same value', () => {
    isFalse(equals(left(1), right(1)))
    isFalse(equals(right(1), left(1)))
  })

})

describe('functor', () => {
  it('works as functor', () => {
    const result = map(inc, e1)
    deepEqual(result, right(2))
  })

  it('returns the same instance for lefts', () => {
    const result = map(inc, l)
    deepEqual(result, l)
  })
})

describe('apply', () => {
  it('works as an apply', () => {
    const result = ap(eitherOf(inc), e1)
    deepEqual(result, eitherOf(2))
  })

  it('returns the same instance for lefts', () => {
    const result = ap(eitherOf(inc), l)
    equal(result, l)
  })
})

describe('chain', () => {
  const incEither = (v: number) => eitherOf(v + 1)
  it('works as a chain', () => {
    const result = chain(incEither, e1)
    deepEqual(result, right(2))
  })
  
  it('returns the same instance for lefts', () => {
    const result = chain(incEither, l)
    equal(result, l)
  })
})

describe('foldable', () => {
  it('works as an foldable', () => {
    const result = reduce(add, 9, e1)
    equal(result, 10)
  })

  it('returns the seed for lefts', () => {
    const result = reduce(add, 10, l)
    equal(result, 10)
  })
})

describe('cata', () => {
  let cataEither: Either<string, number>
  it('reduces a right', () => {
    cataEither = eitherOf(1)
    const result = cata(Number, inc, cataEither)
    equal(result, 2)
  })

  it('redices a left', () => {
    cataEither = left('1')
    const result = cata(Number, inc, cataEither)
    equal(result, 1)
  })
})
