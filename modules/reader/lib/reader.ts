import { Unary } from '@yafu/type-utils'
import { map, ap, chain, of } from 'fantasy-land'

export type Ask<T = unknown> = Reader<T, T>

export function readerOf<T>(a: T): Reader<T> {
  return new ResolvedReader(a)
}

export class Reader<T, Env = unknown> {
  static [of] = readerOf
  static ask: Ask = new Reader((env) => env)

  constructor(public readonly run: (env: Env) => T) {}

  [map]<U>(f: Unary<T, U>): Reader<U, Env> {
    return new Reader((env) => f(this.run(env)))
  }

  [ap]<U>(r: Reader<Unary<T, U>, Env>): Reader<U, Env> {
    return new Reader((env) => r.run(env)(this.run(env)))
  }

  [chain]<U>(f: Unary<T, Reader<U, Env>>): Reader<U, Env> {
    return new Reader((env) => f(this.run(env)).run(env))
  }
}

class ResolvedReader<T> extends Reader<T> {
  constructor(private readonly value: T) {
    super(() => value)
  }

  toString(): string {
    return `Reader(${this.value})`
  }
}

export function runReader<T, Env>(r: Reader<T, Env>, env: Env): T {
  return r.run(env)
}

declare module '@yafu/fantasy-functions' {
  export function of<T>(type: typeof Reader, a: T): Reader<T>
  export function map<T, U, Env>(
    f: Unary<T, U>,
    r: Reader<T, Env>,
  ): Reader<U, Env>
  export function ap<T, U, Env>(
    r: Reader<Unary<T, U>, Env>,
    r2: Reader<T, Env>,
  ): Reader<U, Env>
  export function chain<T, U, Env>(
    f: Unary<T, Reader<U, Env>>,
    r: Reader<T, Env>,
  ): Reader<U, Env>
}
