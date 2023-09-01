import { map, chain, ap, of } from 'fantasy-land'
import { Unary } from '@yafu/type-utils'
import { Identity } from '@yafu/fantasy-types'
import '@yafu/fantasy-functions'

declare module '@yafu/fantasy-functions' {
  export function of<T>(t: typeof RI, value: T): RI<T>
  export function map<Env, T, U>(f: Unary<T, U>, ri: RI<T, Env>): RI<U, Env>
  export function ap<Env, T, U>(f: RI<Unary<T, U>, Env>, ri: RI<T, Env>): RI<U, Env>
  export function chain<Env, T, U>(f: Unary<T, RI<U, Env>>, ri: RI<T, Env>): RI<U, Env>
}

export class RI<T, Env = unknown> {
  static [of]<T>(value: T): RI<T, never>
  static lift: <T>(identity: Identity<T>) => RI<T>
  static ask: Ask<unknown>

  run: Unary<Env, Identity<T>>

  constructor(run: Unary<Env, Identity<T>>)

  [map]<U>(f: Unary<T, U>): RI<U, Env>
  [ap]<U>(f: RI<Unary<T, U>>): RI<U, Env>
  [chain]<U>(f: Unary<T, RI<U, Env>>): RI<U, Env>
}

type Ask<Env = unknown> = RI<Env, Env>
