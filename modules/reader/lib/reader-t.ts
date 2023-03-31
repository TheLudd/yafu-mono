import { HKT, Kind, Unary } from '@yafu/type-utils'
import { Applicable, Apply, Chain, Functor } from '@yafu/fantasy-types'
import { ap as AP, chain as CHAIN, map as MAP, of as OF } from 'fantasy-land'
import { of } from '@yafu/fantasy-functions'
import '@yafu/fantasy-functions'

export interface ReaderTransform<T, Type extends HKT, Env = unknown> {
  [AP]: <U>(
    b: ReaderTransform<Unary<T, U>, Type, Env>,
  ) => ReaderTransform<U, Type, Env>

  [MAP]: <U>(f: Unary<T, U>) => ReaderTransform<U, Type, Env>

  [CHAIN]: <U>(
    f: Unary<T, ReaderTransform<U, Type, Env>>,
  ) => ReaderTransform<U, Type, Env>

  run: (env: Env) => Kind<Type, T>
}

type Ask<Type extends HKT, T = unknown> = ReaderTransform<T, Type, T>

interface ReaderTransformType<Type extends HKT> {
  ask: Ask<Type>

  new <T, Env>(run: Unary<Env, Kind<Type, T>>): ReaderTransform<T, Type, Env>

  lift: <A>(a: Kind<Type, A>) => ReaderTransform<A, Type>

  [OF]: <A>(a: A) => ReaderTransform<A, Type>
}

export function readerT<Type extends HKT, M extends Applicable<Type>>(
  monad: M,
): ReaderTransformType<M> {
  return class R<T, Env = unknown> implements ReaderTransform<T, M, Env> {
    static ask = new R(of(monad))
    static lift = <A>(m: Kind<M, A>) => new R(() => m)

    static [OF]<A>(a: A): ReaderTransform<A, M> {
      return new R(() => monad[OF](a))
    }

    constructor(public readonly run: Unary<Env, Kind<M, T>>) {}

    [AP]<U>(b: R<Unary<T, U>, Env>): R<U, Env> {
      return new R((env) => {
        const inner = b.run(env)
        const val = this.run(env) as Apply<T, Type>
        return val[AP](inner)
      })
    }

    [MAP]<U>(f: Unary<T, U>): R<U, Env> {
      return new R((env) => {
        const m = this.run(env) as Functor<T, M>
        return m[MAP](f)
      })
    }

    [CHAIN]<U>(f: Unary<T, R<U, Env>>): R<U, Env> {
      return new R((env) => {
        const m = this.run(env) as Chain<T, M>
        return m[CHAIN]((t) => f(t).run(env))
      })
    }
  }
}

declare module '@yafu/fantasy-functions' {
  export function of<A, Type extends HKT>(
    rt: ReaderTransformType<Type>,
    a: A,
  ): ReaderTransform<A, Type>

  export function ap<T, U, Type extends HKT>(
    f: ReaderTransform<Unary<T, U>, Type>,
    reader: ReaderTransform<T, Type>,
  ): ReaderTransform<U, Type>

  export function chain<T, U, Type extends HKT>(
    f: Unary<T, ReaderTransform<U, Type>>,
    reader: ReaderTransform<T, Type>,
  ): ReaderTransform<U, Type>

  export function map<T, U, Type extends HKT>(
    f: Unary<T, U>,
    reader: ReaderTransform<T, Type>,
  ): ReaderTransform<U, Type>
}