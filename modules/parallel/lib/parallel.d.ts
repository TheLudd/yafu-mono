import {
  ap,
  bimap,
  chain,
  map,
  of
} from 'fantasy-land'
import { Binary, Unary } from '@yafu/type-utils'
import '@yafu/fantasy-functions'

export type Callback<T> = Unary<T, void>
export type Fork<E, T> = Binary<Callback<E>, Callback<T>, void>

declare module '@yafu/fantasy-functions' {
  export function of<T>(t: typeof Parallel, value: T): Parallel<never, T>
  export function map<E, T, U>(f: Unary<T, U>, p: Parallel<E, T>): Parallel<E, U>
  export function ap<E, T, U>(f: Parallel<E, Unary<T, U>>, p: Parallel<E, T>): Parallel<E, U>
  export function chain<E, T, U>(f: Unary<T, Parallel<E, U>>, p: Parallel<E, T>): Parallel<E, U>
  export function bimap<E, F, T, U>(leftMap: Unary<E, F>, rightMap: Unary<T, U>, p: Parallel<E, T>): Parallel<F, U>
}

export class Parallel<E, T> {
  static [of]<T>(value: T): Parallel<never, T>
  static reject<E>(value: E): Parallel<E, never>

  fork: Fork<E, T>
  constructor(fork: Fork<E, T>)

  [map]<U>(f: Unary<T, U>): Parallel<E, U>
  [ap]<U>(f: Parallel<E, Unary<T, U>>): Parallel<E, U>
  [chain]<U>(f: Unary<T, Parallel<E, U>>): Parallel<E, U>
  [bimap]<F, U>(leftMap: Unary<E, F>, rightMap: Unary<T, U>): Parallel<F, U>
  biChain<F, U>(leftMap: Unary<E, Parallel<F, U>>, rightMap: Unary<T, Parallel<F, U>>): Parallel<F, U>
  rejectMap<F>(f: Unary<E, F>): Parallel<F, T>
  rejectChain<F>(f: Unary<E, Parallel<F, T>>): Parallel<F, T>
}

export function parallelOf<T>(value: T): Parallel<never, T>
export function reject<E>(value: E): Parallel<E, never>
export function bichain<E, F, T, U>(leftMap: Unary<E, Parallel<F, U>>, rightMap: Unary<T, Parallel<F, U>>, p: Parallel<E, T>): Parallel<F, U>
export function swap<E, T, F, U>(f: Unary<E, U>, g: Unary<T, F>, p: Parallel<E, T>): Parallel<F, U>

export function promiseToParallel<T>(promise: Promise<T>): Parallel<unknown, T>
export function parallelToPromise<T>(parallel: Parallel<unknown, T>): Promise<T>
