/* eslint-disable max-classes-per-file */
import { assert } from 'chai'
import { curry } from '@yafu/curry'
import { I } from 'yafu'
import * as FL from 'fantasy-land'
import * as ff from '../dist/es6/fantasy-functions-development.js'

const {
  deepEqual,
  equal,
  isEmpty,
  throws,
} = assert
const {
  ap,
  chain,
  concat,
  empty,
  equals,
  extract,
  filter,
  map,
  of,
  reduce,
  traverse,
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

  [FL.ap] (b) {
    return chain((f) => map(f, this), b)
  }

  [FL.filter] (f) {
    return f(this.v)
  }

  [FL.chain] (f) {
    return f(this.v)
  }

  [FL.reduce] (f, x) {
    return f(x, this.v)
  }

  [FL.extract] () {
    return this.v
  }

  [FL.traverse] (Type, f) {
    return Type[FL.of](new Identity(f(this.v)))
  }

  [FL.equals] (b) {
    return (b instanceof Identity) && b.v === this.v
  }

  toString () {
    return `Identity[${this.v}]`
  }
}

class SubIdentity extends Identity {
  toString () {
    return `SubIdentity[${this.v}]`
  }
}

class SiblingIdentity extends Identity {
  toString () {
    return `SiblingIdentity[${this.v}]`
  }
}

class Const {
  static [FL.of] (v) {
    return new Const(v)
  }

  constructor (v) {
    this.v = v
  }
}

class Add {
  static [FL.empty] () {
    return new Add(0)
  }

  constructor (v) {
    this.v = v
  }

  [FL.concat] (b) {
    return new Add(this.v + b.v)
  }
}

const i2 = of(Identity, 2)
const add = curry((a, b) => a + b)
const inc = (x) => x + 1

function buildMessage (array) {
  return array.join(' ')
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
    const result = map(inc, i1)
    const expected = i2
    deepEqual(result, expected)
  })

  it('should work for unary methods returning the same type', () => {
    const incChain = (x) => new Identity(x + 1)
    const result = chain(incChain, i1)
    const expected = i2
    deepEqual(result, expected)
  })

  it('should work for methods returning a sub type', () => {
    const incChain = (x) => new SubIdentity(x + 1)
    const result = chain(incChain, i1)
    const expected = new SubIdentity(2)
    deepEqual(result, expected)
  })

  it('should work for methods returning a sibling type', () => {
    const incChain = (x) => new SiblingIdentity(x + 1)
    const result = chain(incChain, new SubIdentity(1))
    const expected = new SubIdentity(2)
    deepEqual(result, expected)
  })

  it('should work for binary methods', () => {
    const result = reduce(add, 10, i1)
    equal(result, 11)
  })

  it('should work for static functions', () => {
    const i1b = of(Identity, 1)
    deepEqual(i1b, i1)
  })

  it('should work for nullary static functions', () => {
    deepEqual(empty(Add), new Add(0))
  })

  it('should work for nullary methods', () => {
    equal(extract(i2), 2)
  })

  it('should work when the input is of same type of specific content', () => {
    const result = ap(map(add, i2), i2)
    deepEqual(result, of(Identity, 4))
  })

  it('should work when the input requires a type representative function', () => {
    const result = traverse(Const, inc, i2)
    deepEqual(result, of(Identity, of(Const, 3)))
  })
})

describe('errors', () => {
  it('throws if the input does not have the FL method', () => {
    throws(() => equals(i2, 2), buildMessage([
      `equals expects an object with property ${FL.equals} but got 2`,
    ]))
  })

  it('throws nice errors if input is null', () => {
    throws(() => map(null, i2), buildMessage([
      'map expects a function but got null',
    ]))
  })

  it('throws nice errors if input is undefined', () => {
    throws(() => map(undefined, i2), buildMessage([
      'map expects a function but got undefined',
    ]))
  })

  it('throws for expected _sameType input', () => {
    throws(() => concat(2, empty(Add)), buildMessage([
      'concat expects an instance of Add but got 2',
    ]))
  })

  it('throws for expected _sameType input with expected value inside', () => {
    throws(() => ap(i2, i2), buildMessage([
      'ap expects an instance of Identity containing a function',
      'but got Identity containing 2',
    ]))
  })

  it('throws for expected _sameType input with expected value inside when the main is wrong', () => {
    throws(() => ap(2, i2), buildMessage([
      'ap expects an instance of Identity containing a function',
      'but got 2',
    ]))
  })

  it('throws when non functions are passed as functions with specific return values', () => {
    throws(() => filter('3', i2), buildMessage([
      'filter expects a function returning a boolean but got 3',
    ]))
  })

  it('throws for functions returning primitives', () => {
    throws(() => filter(I, i2), buildMessage([
      'filter expects a function returning',
      'a boolean but got function returning 2',
    ]))
  })

  it('throws when non functions are passed as functions with any return value', () => {
    throws(() => map(3, i2), buildMessage([
      'map expects a function but got 3',
    ]))
  })

  it('throws for functions returning _sameType', () => {
    throws(() => chain(I, i2), buildMessage([
      'chain expects a function returning',
      'an instance of Identity but got function returning 2',
    ]))
  })

  it('throws if a type representative is missing a function', () => {
    throws(() => traverse(Add, inc, i2), buildMessage([
      `traverse expects a type representative with function ${FL.of}`,
      'but got Add',
    ]))
  })
})
