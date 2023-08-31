import { Fold, Unary } from '@yafu/type-utils'
import { Either } from './either.js'

declare module '@yafu/fantasy-functions' {
  export function ap<T, U, L>(f: Either<L, Unary<T, U>>, either: Either<L, T>): Either<L, U>
  export function chain<T, U, L>(f: Unary<T, Either<L, U>>, either: Either<L, T>): Either<L, U>
  export function map<T, U, L>(f: Unary<T, U>, either: Either<L, T>): Either<L, U>
  export function reduce<T, U, L>(f: Fold<T, U>, seed: U, either: Either<L, T>): U
}
