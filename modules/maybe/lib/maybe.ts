import {
  alt as ALT,
  ap as AP,
  of as OF,
  chain as CHAIN,
  equals as EQUALS,
  map as MAP,
  reduce as REDUCE,
} from 'fantasy-land'
import '@yafu/fantasy-functions'
import { map } from '@yafu/fantasy-functions'
import { Fold, Unary, HKTMark } from '@yafu/type-utils'
import './extensions.d.ts'

export type Maybe<T> = Just<T> | Nothing

interface MaybeHKTMark extends HKTMark {
  Type: Maybe<this['T']>
}

export abstract class M {
  static hkt: MaybeHKTMark
  static [OF]<T>(v: T) {
    return new Just(v)
  }
}

export const Maybe = M

abstract class AbstractMaybe {
  static hkt: MaybeHKTMark
  static [OF]<T>(v: T) {
    return new Just(v)
  }
}

class Just<T> extends AbstractMaybe {
  private readonly v: T

  constructor(v: T) {
    super()
    this.v = v
  }

  [MAP]<U>(f: Unary<T, U>): Just<U> {
    return new Just(f(this.v))
  }

  [AP]<U>(a: Maybe<Unary<T, U>>): Maybe<U> {
    return map((f) => f(this.v), a)
  }

  [ALT](): Just<T> {
    return this
  }

  [CHAIN]<U>(f: Unary<T, Maybe<U>>): Maybe<U> {
    return f(this.v)
  }

  [REDUCE]<U>(f: Fold<T, U>, seed: U): U {
    return f(seed, this.v)
  }

  [EQUALS](b: unknown): boolean {
    return b instanceof Just && b.v === this.v
  }
}

class Nothing extends AbstractMaybe {
  [MAP](): Nothing {
    return this
  }

  [AP](): Nothing {
    return this
  }

  [ALT]<T>(b: Maybe<T>): Maybe<T> {
    return b
  }

  [CHAIN](): Nothing {
    return this
  }

  [REDUCE]<U>(_f: Fold<unknown, U>, seed: U): U {
    return seed
  }

  [EQUALS](b: unknown): boolean {
    return b instanceof Nothing
  }
}

export const nothing = new Nothing()

export function maybeOf<T>(v: T): Maybe<T> {
  return new Just(v)
}
