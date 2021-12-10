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
})
