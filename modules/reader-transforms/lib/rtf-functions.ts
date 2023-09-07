import { Unary } from '@yafu/type-utils'
import {
  Parallel as Future,
  Callback,
  promiseToParallel,
  reject,
  swap,
} from '@yafu/parallel'
import { RTF } from './rtf.js'

export const forkInEnv = <E, T, Env>(
  onError: Callback<E>,
  onSuccess: Callback<T>,
  env: Env,
  rtf: RTF<E, T, Env>,
) => {
  rtf.run(env).fork(onError, onSuccess)
}

export const rejectRTF = <E>(e: E) => RTF.lift(reject(e))

export function rejectMapRTF<E, E2, T, Env>(
  fn: Unary<E, E2>,
  rtf: RTF<E, T, Env>,
): RTF<E2, T, Env> {
  return new RTF((env) => rtf.run(env).rejectMap(fn))
}

export function rejectChainRTF<E, E2, T, Env>(
  f: Unary<E, RTF<E2, T, Env>>,
  rtf: RTF<E, T, Env>,
): RTF<E2, T, Env> {
  return new RTF(
    (env) =>
      new Future((reject, resolve) => {
        const innerF = rtf.run(env)
        innerF.fork((e) => {
          f(e).run(env).fork(reject, resolve)
        }, resolve)
      }),
  )
}

export function swapRTF<E, F, T, U, Env>(
  leftMap: Unary<E, U>,
  rightMap: Unary<T, F>,
  rtf: RTF<E, T, Env>,
): RTF<F, U, Env> {
  return new RTF((env) => {
    const future = rtf.run(env)
    return swap(leftMap, rightMap, future)
  })
}

export function rtfToPromise<T, Env>(env: Env, rtf: RTF<unknown, T, Env>) {
  return new Promise<T>((resolve, reject) => {
    forkInEnv(reject, resolve, env, rtf)
  })
}

export function promiseToRTF<T>(promise: Promise<T>): RTF<unknown, T> {
  return new RTF(() => promiseToParallel(promise))
}
