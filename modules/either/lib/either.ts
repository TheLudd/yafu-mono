/* eslint-disable max-classes-per-file */
import {
  ap as AP,
  chain as CHAIN,
  map as MAP,
  of as OF,
  reduce as REDUCE,
} from 'fantasy-land'
import { HKT2, HKT2Mark } from '@yafu/type-utils'
import { Functor, Foldable } from '@yafu/fantasy-types'

// eslint-disable-next-line no-use-before-define
export function eitherOf <L, R>(v: R): Either<L, R> {
  return new Right(v)
}

interface Cata<L, R, U> {
  Right: (r: R) => U,
  Left: (l: L) => U,
}

interface EitherHKTMark extends HKT2Mark {
    Type: Either<this['U'], this['T']>;
}

type Self = Either<never, never>

export default abstract class Either<L, R> implements HKT2, Functor<R, Self>, Foldable<R> {
  static [OF] <T> (v: T) {
    return eitherOf(v)
  }

  hkt!: EitherHKTMark
  hkt2!: EitherHKTMark

  abstract [MAP] <U> (f: (x: R) => U): Either<L, U>

  abstract [AP] <U> (b: Either<L, (x: R) => U>): Either<L, U>

  abstract [CHAIN] <U> (f: (x: R) => Either<L, U>): Either<L, U>

  abstract [REDUCE] <U> (f: (acc: U, item: R) => U, init: U): U

  abstract cata <U> (c: Cata<L, R, U>): U
}

class Right<L, R> extends Either<L, R> {
  v: R

  constructor (v: R) {
    super()
    this.v = v
  }

  [MAP] <U> (f: (x: R) => U) {
    return eitherOf(f(this.v))
  }

  [AP] <U> (b: Either<L, (x: R) => U>) {
    return b[CHAIN]((f) => this[MAP](f))
  }

  [CHAIN] <U> (f: (x: R) => Either<L, U>) {
    return f(this.v)
  }

  [REDUCE] <U> (f: (acc: U, item: R) => U, init: U) {
    return f(init, this.v)
  }

  cata <U> (c: Cata<L, R, U>) {
    const { Right: rightFn } = c
    return rightFn(this.v)
  }

  toString (): string {
    return `Right[${this.v}]`
  }
}

class Left<L, R> extends Either<L, R> {
  v: L

  constructor (v: L) {
    super()
    this.v = v
  }

  [MAP] () {
    return this
  }

  [AP] () {
    return this
  }

  [CHAIN] () {
    return this
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  [REDUCE] <U> (_f: (acc: U, item: any) => U, init: U): U {
    return init
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cata <U> (c: Cata<L, any, U>) {
    const { Left: leftFn } = c
    return leftFn(this.v)
  }

  toString (): string {
    return `Left[${this.v}]`
  }
}

export function left <L, T> (x: L): Either<L, T> {
  return new Left(x)
}

export function right <L, T> (x: T): Either<L, T> {
  return new Right(x)
}

export function cata <L, T, U> (
  ifLeft: (l: L) => U,
  ifRight: (r: T) => U,
  either: Either<L, T>,
): U {
  return either.cata({
    Left: ifLeft,
    Right: ifRight,
  })
}
