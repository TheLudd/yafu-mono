/* eslint-disable max-classes-per-file */
import {
  alt as ALT,
  ap as AP,
  chain as CHAIN,
  equals as EQUALS,
  map as MAP,
  of as OF,
  reduce as REDUCE,
} from 'fantasy-land'
import { Unary, HKTMark, HKT2Mark, HKT2 } from '@yafu/type-utils'
import '@yafu/fantasy-functions'
import './extensions.d.ts'

export function eitherOf<R>(v: R): Either<never, R> {
  return new Right(v)
}

interface Cata<L, R, U> {
  Left: (l: L) => U
  Right: (r: R) => U
}

export type Either<L, R> = Left<L> | Right<R>

interface EitherHKT1Mark extends HKTMark {
  Type: Either<never, this['T']>
}

interface EitherHKTMark extends HKT2Mark {
  Type: Either<this['U'], this['T']>
}

class AbstractEither implements HKT2 {
  hkt!: EitherHKT1Mark
  hkt2!: EitherHKTMark
  static [OF]<T>(v: T) {
    return new Right(v)
  }
}

export const Either = AbstractEither

class Right<R> extends AbstractEither {
  v: R

  constructor(v: R) {
    super()
    this.v = v
  }

  [EQUALS](b: unknown): boolean {
    return b instanceof Right && this.v === b.v
  }

  [MAP]<U>(f: Unary<R, U>) {
    return eitherOf(f(this.v))
  }

  [AP]<U, L>(b: Either<L, (x: R) => U>): Either<L, U> {
    return b[CHAIN]((f) => this[MAP](f))
  }

  [ALT](): Either<never, R> {
    return this
  }

  [CHAIN]<U, L>(f: (x: R) => Either<L, U>) {
    return f(this.v)
  }

  [REDUCE]<U>(f: (acc: U, item: R) => U, init: U) {
    return f(init, this.v)
  }

  cata<U>(c: Cata<never, R, U>) {
    const { Right: rightFn } = c
    return rightFn(this.v)
  }

  toString(): string {
    return `Right[${this.v}]`
  }
}

class Left<L> extends AbstractEither {
  v: L

  constructor(v: L) {
    super()
    this.v = v
  }

  [EQUALS](b: unknown): boolean {
    return b instanceof Left && this.v === b.v
  }

  [MAP](_f: unknown) {
    return this
  }

  [AP](_b: unknown) {
    return this
  }

  [ALT]<R>(b: Either<L, R>): Either<L, R> {
    return b
  }

  [CHAIN](_f: unknown) {
    return this
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  [REDUCE]<U>(_f: (acc: U, item: any) => U, seed: U): U {
    return seed
  }

  cata<U>(c: Cata<L, never, U>) {
    const { Left: leftFn } = c
    return leftFn(this.v)
  }

  toString(): string {
    return `Left[${this.v}]`
  }
}

export function left<L>(x: L): Either<L, never> {
  return new Left(x)
}

export const right = eitherOf

export function cata<L, T, U>(
  ifLeft: (l: L) => U,
  ifRight: (r: T) => U,
  either: Either<L, T>,
): U {
  return either.cata({
    Left: ifLeft,
    Right: ifRight,
  })
}
