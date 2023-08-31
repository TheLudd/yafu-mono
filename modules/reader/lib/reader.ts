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
