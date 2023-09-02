import { Unary } from '@yafu/type-utils'
import { Reader } from './reader.js'

declare module '@yafu/fantasy-functions' {
  export function of<T>(type: typeof Reader, a: T): Reader<T>
  export function map<T, U, Env>(f: Unary<T, U>, r: Reader<T, Env>): Reader<U, Env>
  export function ap<T, U, Env>(r: Reader<Unary<T, U>, Env>, r2: Reader<T, Env>): Reader<U, Env>
  export function chain<T, U, Env>(f: Unary<T, Reader<U, Env>>, r: Reader<T, Env>): Reader<U, Env>
}
