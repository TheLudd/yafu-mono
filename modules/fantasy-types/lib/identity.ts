import { Fold, HKT, HKTMark, Kind, Unary } from '@yafu/type-utils'
import {
  ap,
  chain,
  equals,
  extend,
  extract,
  map,
  of,
  reduce,
  traverse,
} from 'fantasy-land'
import {
  Applicable,
  Chain,
  Comonad,
  Functor,
  Setoid,
  Traversable,
} from '../dist/fantasy-types.js'

interface IdentityHKTMark extends HKTMark {
  Type: Identity<this['T']>
}

export function identityOf<A>(a: A): Identity<A> {
  return new Identity(a)
}

type Self = Identity<never>

export class Identity<T>
  implements
    HKT,
    Setoid,
    Chain<T, Self>,
    Comonad<T, Self>,
    Traversable<T, Self>
{
  hkt!: IdentityHKTMark
  static hkt: IdentityHKTMark

  static [of]<A>(a: A) {
    return new Identity(a)
  }

  private v

  constructor(v: T) {
    this.v = v
  }

  [equals](a: any) {
    return a instanceof Identity && this.v === a.v
  }

  [map]<U>(f: Unary<T, U>): Identity<U> {
    return new Identity(f(this.v))
  }

  [ap]<U>(b: Identity<Unary<T, U>>): Identity<U> {
    return new Identity(b.v(this.v))
  }

  [chain]<U>(f: Unary<T, Identity<U>>): Identity<U> {
    return f(this.v)
  }

  [extend]<U>(f: Unary<Identity<T>, U>): Identity<U> {
    return new Identity(f(this))
  }

  [extract](): T {
    return this.v
  }

  [reduce]<U>(f: Fold<T, U>, init: U): U {
    return f(init, this.v)
  }

  [traverse]<U, X extends HKT>(
    _a: Applicable<X>,
    f: Unary<T, Kind<X, U>>,
  ): Kind<X, Identity<U>> {
    const t = f(this.v) as Functor<U, X>
    return t[map](identityOf)
  }

  toString() {
    return `Identity[${this.v}]`
  }
}
