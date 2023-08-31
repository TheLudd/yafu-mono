import { Fold, Unary } from '@yafu/type-utils'
import { Maybe } from './maybe.js'

declare module '@yafu/fantasy-functions' {
  export function ap<T, U>(a: Maybe<Unary<T, U>>, apply: Maybe<T>): Maybe<U>
  export function chain<T, U>(f: Unary<T, Maybe<U>>, m: Maybe<T>): Maybe<U>
  export function map<T, U>(f: Unary<T, U>, m: Maybe<T>): Maybe<U>
  export function reduce<T, U>(f: Fold<T, U>, seed: U, m: Maybe<T>): U
}
