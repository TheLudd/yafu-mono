import { IO } from './io.js'

declare module '@yafu/fantasy-functions' {
  export function of<T>(io: typeof IO, v: T): IO<[], T>
  export function map<T, U, Args extends unknown[]>(f: (v: T) => U, v: IO<Args, T>): IO<Args, U>
  export function ap<T, U, Args extends unknown[]>(f: IO<Args, (v: T) => U>, v: IO<Args, T>): IO<Args, U>
  export function chain<T, U, Args extends unknown[]>(f: (v: T) => IO<Args, U>, v: IO<Args, T>): IO<Args, U>
}
