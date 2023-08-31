import { Fold, HKT, Unary, Kind, Predicate } from '@yafu/type-utils'
import { Applicable } from '@yafu/fantasy-types'
import * as FL from 'fantasy-land'

declare global {
  interface Array<T> {
    [FL.equals](b: unknown): boolean
    [FL.concat](b: T[]): T[]
    [FL.map]<U>(f: Unary<T, U>): U[]
    [FL.ap]<U>(b: Unary<T, U>[]): U[]
    [FL.chain]<U>(f: Unary<T, U[]>): U[]
    [FL.reduce]<U>(f: Fold<T, U>, init: U): U
    [FL.traverse]<X extends HKT, U>(applicable: Applicable<X>, f: Unary<T, Kind<X, U>>): Kind<X, U[]>
  }
}

declare module '@yafu/fantasy-functions' {
  export function concat<T>(a: Array<T>, b: Array<T>): Array<T>
  export function ap<T, U>(a: Array<Unary<T, U>>, apply: Array<T>): Array<U>
  export function chain<T, U>(f: Unary<T, Array<U>>, m: Array<T>): Array<U>
  export function filter<T>(f: Predicate<T>, m: Array<T>): Array<T>
  export function map<T, U>(f: Unary<T, U>, m: Array<T>): Array<U>
  export function reduce<T, U>(f: Fold<T, U>, seed: U, m: Array<T>): U
  export function traverse<X extends HKT, T, U>(applicable: Applicable<X>, f: Unary<T, Kind<X, U>>, traversable: Array<T>): Kind<X, Array<U>>
}

declare function polyfill (): void

export default polyfill
