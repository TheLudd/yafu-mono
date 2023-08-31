import { HKT, Unary } from '@yafu/type-utils'
import { Reader } from './reader.js'
import { ReaderTransform, ReaderTransformType } from './reader-t.js'

declare module '@yafu/fantasy-functions' {
  export function of<T>(type: typeof Reader, a: T): Reader<T>
  export function map<T, U, Env>(f: Unary<T, U>, r: Reader<T, Env>): Reader<U, Env>
  export function ap<T, U, Env>(r: Reader<Unary<T, U>, Env>, r2: Reader<T, Env>): Reader<U, Env>
  export function chain<T, U, Env>(f: Unary<T, Reader<U, Env>>, r: Reader<T, Env>): Reader<U, Env>
}

declare module '@yafu/fantasy-functions' {
  export function of<A, Type extends HKT>(rt: ReaderTransformType<Type>, a: A): ReaderTransform<A, Type>
  export function ap<T, U, Type extends HKT>(f: ReaderTransform<Unary<T, U>, Type>, reader: ReaderTransform<T, Type>): ReaderTransform<U, Type>
  export function chain<T, U, Type extends HKT>(f: Unary<T, ReaderTransform<U, Type>>, reader: ReaderTransform<T, Type>): ReaderTransform<U, Type>
  export function map<T, U, Type extends HKT>(f: Unary<T, U>, reader: ReaderTransform<T, Type>): ReaderTransform<U, Type>
}
