import { map, chain, ap, of } from 'fantasy-land'
import { Unary } from '@yafu/type-utils'
import { Parallel } from '@yafu/parallel'
import '@yafu/fantasy-functions'

declare module '@yafu/fantasy-functions' {
  export function of<T>(t: typeof RTF, value: T): RTF<never, T>
  export function map<E, T, U, Env>(f: Unary<T, U>, rtf: RTF<E, T, Env>): RTF<E, U, Env>
  export function ap<E, T, U, Env, Env2>(f: RTF<E, Unary<T, U>, Env2>, rtf: RTF<E, T, Env>): RTF<E, U, Env & Env2>
  export function chain<E, T, U, Env, Env2>(f: Unary<T, RTF<E, U, Env2>>, rtf: RTF<E, T, Env>): RTF<E, U, Env & Env2>
}

export namespace RTF {
  export type Ask<Env = unknown> = RTF<never, Env, Env>
}

export class RTF<E, T, Env = unknown> {
  static [of]<T>(value: T): RTF<never, T>
  static lift: <E, T>(io: Parallel<E, T>) => RTF<E, T>
  static ask: RTF.Ask
  static asks: <E, Focus>(f: Unary<E, Focus>) => RTF<never, Focus, E>

  public run: Unary<Env, Parallel<E, T>>

  constructor(run: Unary<Env, Parallel<E, T>>)

  [map]<U>(f: Unary<T, U>): RTF<E, U, Env>
  [ap]<U>(f: RTF<E, Unary<T, U>, Env>): RTF<E, U, Env>
  [chain]<U>(f: Unary<T, RTF<E, U, Env>>): RTF<E, U, Env>
}
