import { RIO, RTE, RTF } from './index.js'

export const run = <E, T, Env>(r: RIO<T> | RTE<E, T> | RTF<E, T>, env: Env) => {
  return r.run(env)
}
