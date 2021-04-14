/* eslint-disable max-classes-per-file */
import { assert } from 'chai'
import * as FL from 'fantasy-land'
import * as ff from '../dist/es6/fantasy-functions-production.js'

const { deepEqual, equal, isEmpty } = assert
const {
  empty,
  map,
  of,
  reduce,
} = ff

class Identity {
  static [FL.of] (v) {
    return new Identity(v)
  }

  constructor (v) {
    this.v = v
  }

  [FL.map] (f) {
    return new Identity(f(this.v))
  }

  [FL.reduce] (f, x) {
    return f(x, this.v)
  }
}

class Add {
  static [FL.empty] () {
    return new Add(0)
  }

  static [FL.of] (v) {
    return new Add(v)
  }

  constructor (v) {
    this.v = v
  }
}

describe('fantasyFunctions', () => {
  const i1 = Identity[FL.of](1)
  const flKeys = Object.keys(FL).filter((k) => k !== 'default')
  const countKeys = (o) => Object.keys(o).length

  it('should have the same amount of functions as specified by FL', () => {
    const nulls = flKeys.filter((x) => ff[x] == null)
    isEmpty(nulls, 'Some methods were undefined')
    equal(countKeys(ff), flKeys.length)
  })

  it('should work for unary methods', () => {
    const inc = (x) => x + 1
    const result = map(inc, i1)
    const expected = Identity[FL.of](2)
    deepEqual(result, expected)
  })

  it('should work for binary methods', () => {
    const add = (a, b) => a + b
    const result = reduce(add, 10, i1)
    equal(result, 11)
  })

  it('should work for static functions', () => {
    const i1b = of(Identity, 1)
    deepEqual(i1b, i1)
  })

  it('should work for nullary functions', () => {
    deepEqual(empty(Add), of(Add, 0))
  })
})
