import { map, chain, ap, of } from 'fantasy-land'
import { Unary } from '@yafu/type-utils'
import { IO } from '@yafu/io'
import '@yafu/fantasy-functions'

declare module '@yafu/fantasy-functions' {
  export function of<T>(t: typeof RIO, value: T): RIO<T>
  export function map<T, U, IOArgs extends unknown[], Env>(f: Unary<T, U>, ri: RIO<T, IOArgs, Env>): RIO<U, IOArgs, Env>
  export function ap<T, U, IOArgs extends unknown[], Env>(f: RIO<Unary<T, U>, IOArgs, Env>, ri: RIO<T, IOArgs, Env>): RIO<U, IOArgs, Env>
  export function chain<T, U, IOArgs extends unknown[], Env>(f: Unary<T, RIO<U, IOArgs, Env>>, ri: RIO<T, IOArgs, Env>): RIO<U, IOArgs, Env>
}

export namespace RIO {
  export type Ask<Env = unknown> = RIO<Env, [], Env>
}

export class RIO<T, IOArgs extends unknown[] = unknown[], Env = unknown> {
  static [of]<T>(value: T): RIO<T, []>
  static lift: <T, IOArgs extends unknown[]>(
    io: IO<IOArgs, T>,
  ) => RIO<T, IOArgs>
  static ask: RIO.Ask

  public run: Unary<Env, IO<IOArgs, T>>

  constructor(run: Unary<Env, IO<IOArgs, T>>)

  [map]<U>(f: Unary<T, U>): RIO<U, IOArgs, Env>
  [ap]<U>(f: RIO<Unary<T, U>, IOArgs, Env>): RIO<U, IOArgs, Env>
  [chain]<U>(f: Unary<T, RIO<U, IOArgs, Env>>): RIO<U, IOArgs, Env>
}
