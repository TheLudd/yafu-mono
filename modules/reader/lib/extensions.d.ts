import { Unary } from '@yafu/type-utils'
import { Reader } from './reader.js'

declare module '@yafu/fantasy-functions' {
  export function of<T>(type: typeof Reader, a: T): Reader<T>
  export function map<T, U, Env>(f: Unary<T, U>, r: Reader<T, Env>): Reader<U, Env>
  export function ap<T, U, Env, Env2>(r: Reader<Unary<T, U>, Env2>, r2: Reader<T, Env>): Reader<U, Env & Env2>
  export function chain<T, U, Env, Env2>(f: Unary<T, Reader<U, Env2>>, r: Reader<T, Env>): Reader<U, Env & Env2>
}
