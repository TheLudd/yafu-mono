import { map, chain, ap, of } from 'fantasy-land'
import { Unary } from '@yafu/type-utils'
import { Either } from '@yafu/either'
import '@yafu/fantasy-functions'

declare module '@yafu/fantasy-functions' {
  export function of<T>(t: typeof RTE, value: T): RTE<never, T>
  export function map<E, T, U, Env>(f: Unary<T, U>, rte: RTE<E, T, Env>): RTE<E, U, Env>
  export function ap<E, T, U, Env>(f: RTE<E, Unary<T, U>, Env>, rte: RTE<E, T, Env>): RTE<E, U, Env>
  export function chain<E, T, U, Env>(f: Unary<T, RTE<E, U, Env>>, rte: RTE<E, T, Env>): RTE<E, U, Env>
}

export namespace RTE {
  export type Ask<Env = unknown> = RTE<never, Env, Env>
}

export class RTE<E, T, Env = unknown> {
  static [of]<T>(value: T): RTE<never, T>
  static lift: <E, T>(io: Either<E, T>) => RTE<E, T>
  static ask: RTE.Ask
  static asks: <E, Focus>(f: Unary<E, Focus>) => RTE<never, Focus, E>

  public run: Unary<Env, Either<E, T>>

  constructor(run: Unary<Env, Either<E, T>>)

  [map]<U>(f: Unary<T, U>): RTE<E, U, Env>
  [ap]<U>(f: RTE<E, Unary<T, U>, Env>): RTE<E, U, Env>
  [chain]<U>(f: Unary<T, RTE<E, U, Env>>): RTE<E, U, Env>
}
