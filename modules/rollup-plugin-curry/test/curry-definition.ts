import { assert } from 'chai'
import curryDefinition from '../lib/curry-definition.js'

const { equal } = assert

describe('curryDefinition', () => {
  it('replaces the code in the right place', () => {
    const code = `
export interface Dummy {}
export declare function unary (a: number): number
`
    const result = curryDefinition(code)
    const expeced = code
    equal(result, expeced)
  })

  it('can insert multiple functions', () => {
    const code = `
export interface Dummy {}
export declare function unary (a: number): number
export declare function binary (a: number, b: string): number
`
    const result = curryDefinition(code)
    const expeced = `
export interface Dummy {}
export declare function unary (a: number): number
export declare function binary (a: number): (b: string) => number
export declare function binary (a: number, b: string): number
`
    equal(result, expeced)
  })

  it('can insert multiple functions with data inbetween', () => {
    const code = `
export interface Dummy {}
export declare function unary (a: number): number

export interface Dummy2 {}
export declare function binary (a: number, b: string): number
`
    const result = curryDefinition(code)
    const expeced = `
export interface Dummy {}
export declare function unary (a: number): number

export interface Dummy2 {}
export declare function binary (a: number): (b: string) => number
export declare function binary (a: number, b: string): number
`
    equal(result, expeced)
  })

  it('does not add the export keyword where it does not exist', () => {
    const code = `
declare function unary (a: number): number

declare function binary (a: number, b: string): number
`
    const result = curryDefinition(code)
    const expeced = `
declare function unary (a: number): number

declare function binary (a: number): (b: string) => number
declare function binary (a: number, b: string): number
`
    equal(result, expeced)
  })

  it('works', () => {
   const code = `
export declare function ap<T, U, Type extends Apply<T, HKT>>(f: Kind<Type, Unary<T, U>>, apply: Type): Kind<Type, U>
`
    const result = curryDefinition(code)
    const expeced = `
export declare function ap <T, U, Type extends Apply<T, HKT>>(f: Kind<Type, Unary<T, U>>): (apply: Type) => Kind<Type, U>
export declare function ap <T, U, Type extends Apply<T, HKT>>(f: Kind<Type, Unary<T, U>>, apply: Type): Kind<Type, U>
`
    equal(result, expeced)
  })

  it('works with module declarations', () => {
    const code = `
declare module 'someModule' {
  function unary (a: number): number

  function binary (a: number, b: string): number
}
`
    const result = curryDefinition(code)
    const expected = `
declare module 'someModule' {
  function unary (a: number): number

  function binary (a: number): (b: string) => number
  function binary (a: number, b: string): number
}
`
    equal(result, expected)
  })
})
