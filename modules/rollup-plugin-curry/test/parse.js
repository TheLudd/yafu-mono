import { assert } from 'chai'
import parse, { parseGenerics, parseParameters, parseName } from '../lib/parse.js'

const { equal, deepEqual } = assert

const propOr = 'export function propOr <A, B>(a: A, b: string, c: B): A'

describe('parse', () => {
  it('', () => {
    const result = parse(propOr)
    const expected = {
      name: 'propOr',
      generics: [ 'A', 'B' ],
      type: 'A',
      parameters: [
        { name: 'a', type: 'A' },
        { name: 'b', type: 'string' },
        { name: 'c', type: 'B' },
      ]
    }
    deepEqual(result, expected)
  })
})

describe('parseName', () => {
  it('finds the name', () => {
    const result = parseName(propOr)
    equal(result, 'propOr')
  })
})

describe('parseGenerics', () => {
  it('finds generics', () => {
    const result = parseGenerics(propOr)
    deepEqual(result, [ 'A', 'B' ])
  })

  it('finds generics without space', () => {
    const result = parseGenerics('export function propOr <A,B>(a: A, b: string, c: B): A')
    deepEqual(result, [ 'A', 'B' ])
  })

  it('finds generics with much space', () => {
    const result = parseGenerics('export function propOr < A,  B >(a: A, b: string, c: B): A')
    deepEqual(result, [ 'A', 'B' ])
  })

  it('finds generics with only one occurance', () => {
    const result = parseGenerics('export function propOr <A>(a: A, b: string, c: B): A')
    deepEqual(result, [ 'A' ])
  })

  it('returns an empty array if there are no generics', () => {
    const result = parseGenerics('export function toString (a: any): string')
    deepEqual(result, [])
  })
})

describe('parseParameters', () => {
  it('works', () => {
    const result = parseParameters('export function toString (a: any): string')
    deepEqual(result, [ {
      name: 'a',
      type: 'any',
    } ])
  })

  it('works', () => {
    const result = parseParameters(propOr)
    deepEqual(result, [ {
      name: 'a',
      type: 'A',
    }, {
      name: 'b',
      type: 'string',
    }, {
      name: 'c',
      type: 'B',
    } ])
  })

  it('works', () => {
    const result = parseParameters('(f: (x: A) => B, l: A[])')
    deepEqual(result, [ {
      name: 'f',
      type: '(x: A) => B',
    }, {
      name: 'l',
      type: 'A[]',
    } ])
  })

  it('works', () => {
    const result = parseParameters('(f: (acc: B, item: A) => B, init: B, l: A[])')
    deepEqual(result, [ {
      name: 'f',
      type: '(acc: B, item: A) => B',
    }, {
      name: 'init',
      type: 'B',
    }, {
      name: 'l',
      type: 'A[]',
    } ])
  })
})

describe('acceptance tests', () => {
  it('works for uniq-by', () => {
    const uniqBy = 'export declare function uniqBy<A, B>(fn: (a: A) => B, list: A[]): A[];'
    const result = parse(uniqBy)
    const expected = {
      name: 'uniqBy',
      generics: [ 'A', 'B' ],
      type: 'A[]',
      parameters: [
        { name: 'fn', type: '(a: A) => B' },
        { name: 'list', type: 'A[]' },
      ]
    }
    deepEqual(result, expected)
  })

  it('works for non function statements', () => {
    const uniq = 'export declare const uniq: <A>(list: A[]) => A[];'
    const result = parse(uniq)
    const expected = {
      name: 'uniq',
      generics: [ 'A' ],
      type: 'A[]',
      parameters: [
        { name: 'list', type: 'A[]' },
      ]
    }
    deepEqual(result, expected)
  })

  it('works', () => {
   const composeBinary = 'export declare function composeBinary<A, B, C, D>(f: (c: C) => D, g: (a: A, b: B) => C, x: A, y: B): D;'
    const result = parse(composeBinary)
    const expected = {
      name: 'composeBinary',
      generics: [ 'A', 'B', 'C', 'D' ],
      type: 'D',
      parameters: [
        { name: 'f', type: '(c: C) => D' },
        { name: 'g', type: '(a: A, b: B) => C' },
        { name: 'x', type: 'A' },
        { name: 'y', type: 'B' },
      ]
    }
    deepEqual(result, expected)
  })
})
