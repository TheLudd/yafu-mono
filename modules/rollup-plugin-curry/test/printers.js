import { assert } from 'chai'
import curryPrint from '../lib/curry-print.js'

const { equal } = assert
it('printUnary', () => {
  const definition = {
    name: 'inc',
    generics: [],
    parameters: [ {
      name: 'n',
      type: 'number',
    } ],
    type: 'number',
  }
  const result = curryPrint(definition)
  const expected = 'export function inc (n: number): number'
  equal(result, expected)
})

it('printBinary', () => {
  const definition = {
    name: 'K',
    generics: [ 'A', 'B' ],
    parameters: [ {
      name: 'a',
      type: 'A',
    }, {
      name: 'b',
      type: 'B',
    } ],
    type: 'A',
  }
  const result = curryPrint(definition)
  const expected = `
export function K <A, B>(a: A): (b: B) => A
export function K <A, B>(a: A, b: B): A
`.trim()
  equal(result, expected)
})

it('printTernary', () => {
  const definition = {
    name: 'reduce',
    generics: [ 'A', 'B' ],
    parameters: [ {
      name: 'fn',
      type: '(acc: B, item: A) => B',
    }, {
      name: 'init',
      type: 'B',
    }, {
      name: 'list',
      type: 'A[]',
    } ],
    type: 'A',
  }
  const result = curryPrint(definition)
  const expected = `
export function reduce <A, B>(fn: (acc: B, item: A) => B): {
  (init: B): (list: A[]) => A
  (init: B, list: A[]): A
}
export function reduce <A, B>(fn: (acc: B, item: A) => B, init: B): (list: A[]) => A
export function reduce <A, B>(fn: (acc: B, item: A) => B, init: B, list: A[]): A
`.trim()
  equal(result, expected)
})

it('printQuaternary', () => {
  const definition = {
    name: 'someName',
    generics: [ 'A', 'B', 'C', 'D' ],
    type: 'D',
    parameters: [
      { name: 'a', type: 'A' },
      { name: 'b', type: 'B' },
      { name: 'c', type: 'C' },
      { name: 'd', type: 'D' },
    ],
  }
  const result = curryPrint(definition)
  const expected = `
export function someName <A, B, C, D>(a: A): {
  (b: B): {
    (c: C): (d: D) => D
    (c: C, d: D): D
  }
  (b: B, c: C): (d: D) => D
  (b: B, c: C, d: D): D
}
export function someName <A, B, C, D>(a: A, b: B): {
  (c: C): (d: D) => D
  (c: C, d: D): D
}
export function someName <A, B, C, D>(a: A, b: B, c: C): (d: D) => D
export function someName <A, B, C, D>(a: A, b: B, c: C, d: D): D
`.trim()
  equal(result, expected)
})
