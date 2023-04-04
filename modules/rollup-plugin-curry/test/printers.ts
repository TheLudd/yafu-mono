import { assert } from 'chai'
import curryPrint from '../lib/curry-print.js'

const { equal } = assert

it('printUnary', () => {
  const definition = {
    name: 'inc',
    parameters: [
      {
        name: 'n',
        type: 'number',
      },
    ],
    type: 'number',
  }
  const result = curryPrint(definition)
  const expected = 'export declare function inc (n: number): number'
  equal(result, expected)
})

it('printUnary - with generics', () => {
  const definition = {
    name: 'I',
    parameters: [
      {
        name: 'a',
        type: 'A',
        generics: ['A'],
      },
    ],
    type: 'A',
  }
  const result = curryPrint(definition)
  const expected = 'export declare function I <A>(a: A): A'
  equal(result, expected)
})

it('printBinary', () => {
  const definition = {
    name: 'map',
    parameters: [
      {
        name: 'f',
        type: 'Unary<A, B>',
        generics: ['A', 'B'],
      },
      {
        name: 'functor',
        type: 'A[]',
      },
    ],
    type: 'B[]',
  }
  const result = curryPrint(definition)
  const expected = `
export declare function map <A, B>(f: Unary<A, B>): (functor: A[]) => B[]
export declare function map <A, B>(f: Unary<A, B>, functor: A[]): B[]
`.trim()
  equal(result, expected)
})

it('printBinary - later generics', () => {
  const definition = {
    name: 'K',
    parameters: [
      {
        name: 'a',
        type: 'A',
        generics: ['A'],
      },
      {
        name: 'b',
        type: 'B',
        generics: ['B'],
      },
    ],
    type: 'A',
  }
  const result = curryPrint(definition)
  const expected = `
export declare function K <A>(a: A): <B>(b: B) => A
export declare function K <A, B>(a: A, b: B): A
`.trim()
  equal(result, expected)
})

it('printTernary', () => {
  const definition = {
    name: 'reduce',
    parameters: [
      {
        name: 'fn',
        type: '(acc: B, item: A) => B',
        generics: ['A', 'B'],
      },
      {
        name: 'init',
        type: 'B',
      },
      {
        name: 'list',
        type: 'A[]',
      },
    ],
    type: 'A',
  }
  const result = curryPrint(definition)
  const expected = `
export declare function reduce <A, B>(fn: (acc: B, item: A) => B): {
  (init: B): (list: A[]) => A
  (init: B, list: A[]): A
}
export declare function reduce <A, B>(fn: (acc: B, item: A) => B, init: B): (list: A[]) => A
export declare function reduce <A, B>(fn: (acc: B, item: A) => B, init: B, list: A[]): A
`.trim()
  equal(result, expected)
})

it('printTernary - later generics', () => {
  const definition = {
    name: 'aFun',
    parameters: [
      {
        name: 'fn',
        type: '(acc: B, item: A) => B',
        generics: ['A', 'B'],
      },
      {
        name: 'c',
        type: 'C',
        generics: ['C'],
      },
      {
        name: 'list',
        type: 'A[]',
      },
    ],
    type: 'C',
  }
  const result = curryPrint(definition)
  const expected = `
export declare function aFun <A, B>(fn: (acc: B, item: A) => B): {
  <C>(c: C): (list: A[]) => C
  <C>(c: C, list: A[]): C
}
export declare function aFun <A, B, C>(fn: (acc: B, item: A) => B, c: C): (list: A[]) => C
export declare function aFun <A, B, C>(fn: (acc: B, item: A) => B, c: C, list: A[]): C
`.trim()
  equal(result, expected)
})

it('printQuaternary', () => {
  const definition = {
    name: 'someName',
    type: 'D',
    parameters: [
      { name: 'a', type: 'A', generics: ['A', 'B', 'C', 'D'] },
      { name: 'b', type: 'B' },
      { name: 'c', type: 'C' },
      { name: 'd', type: 'D' },
    ],
  }
  const result = curryPrint(definition)
  const expected = `
export declare function someName <A, B, C, D>(a: A): {
  (b: B): {
    (c: C): (d: D) => D
    (c: C, d: D): D
  }
  (b: B, c: C): (d: D) => D
  (b: B, c: C, d: D): D
}
export declare function someName <A, B, C, D>(a: A, b: B): {
  (c: C): (d: D) => D
  (c: C, d: D): D
}
export declare function someName <A, B, C, D>(a: A, b: B, c: C): (d: D) => D
export declare function someName <A, B, C, D>(a: A, b: B, c: C, d: D): D
`.trim()
  equal(result, expected)
})

it('printQuaternary - with later generics', () => {
  const definition = {
    name: 'someName',
    type: 'D',
    parameters: [
      { name: 'a', type: 'A', generics: ['A'] },
      { name: 'b', type: 'B', generics: ['B'] },
      { name: 'c', type: 'C', generics: ['C'] },
      { name: 'd', type: 'D', generics: ['D'] },
    ],
  }
  const result = curryPrint(definition)
  const expected = `
export declare function someName <A>(a: A): {
  <B>(b: B): {
    <C>(c: C): <D>(d: D) => D
    <C, D>(c: C, d: D): D
  }
  <B, C>(b: B, c: C): <D>(d: D) => D
  <B, C, D>(b: B, c: C, d: D): D
}
export declare function someName <A, B>(a: A, b: B): {
  <C>(c: C): <D>(d: D) => D
  <C, D>(c: C, d: D): D
}
export declare function someName <A, B, C>(a: A, b: B, c: C): <D>(d: D) => D
export declare function someName <A, B, C, D>(a: A, b: B, c: C, d: D): D
`.trim()
  equal(result, expected)
})

it('printQuaternary - with later generics version 2', () => {
  const definition = {
    name: 'someName',
    type: 'D',
    parameters: [
      { name: 'a', type: 'A', generics: ['A'] },
      { name: 'b', type: 'B', generics: ['B'] },
      { name: 'c', type: 'B' },
      { name: 'd', type: 'Unary<C, D>', generics: ['C', 'D'] },
    ],
  }
  const result = curryPrint(definition)
  const expected = `
export declare function someName <A>(a: A): {
  <B>(b: B): {
    (c: B): <C, D>(d: Unary<C, D>) => D
    <C, D>(c: B, d: Unary<C, D>): D
  }
  <B>(b: B, c: B): <C, D>(d: Unary<C, D>) => D
  <B, C, D>(b: B, c: B, d: Unary<C, D>): D
}
export declare function someName <A, B>(a: A, b: B): {
  (c: B): <C, D>(d: Unary<C, D>) => D
  <C, D>(c: B, d: Unary<C, D>): D
}
export declare function someName <A, B>(a: A, b: B, c: B): <C, D>(d: Unary<C, D>) => D
export declare function someName <A, B, C, D>(a: A, b: B, c: B, d: Unary<C, D>): D
`.trim()
  equal(result, expected)
})
