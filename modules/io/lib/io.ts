import { ap, chain, map, of } from 'fantasy-land'
import '@yafu/fantasy-functions'
import { HKT, HKTMark } from '@yafu/type-utils'

interface IOHKTMark extends HKTMark {
  Type: IO<unknown[], this['T']>
}

export function runIO2<A, B, T>(a: A, b: B, io: IO<[A, B], T>) {
  return io.runIO(a, b)
}

export function runIO1<A, T>(a: A, io: IO<[A], T>) {
  return io.runIO(a)
}

export function runIO<T>(io: IO<[], T>) {
  return io.runIO()
}

export function ioOf<A>(v: A) {
  return new IO(() => v)
}

export class IO<RunArgs extends unknown[] = unknown[], T = void>
  implements HKT
{
  static [of] = ioOf

  hkt!: IOHKTMark
  static hkt: IOHKTMark

  constructor(public readonly runIO: (...args: RunArgs) => T) {
    this.runIO = runIO
  }

  [map]<U>(f: (v: T) => U): IO<RunArgs, U> {
    return new IO((...args) => f(this.runIO(...args)))
  }

  [ap]<U>(b: IO<RunArgs, (v: T) => U>): IO<RunArgs, U> {
    return new IO((...args) => b.runIO(...args)(this.runIO(...args)))
  }

  [chain]<U>(f: (v: T) => IO<RunArgs, U>): IO<RunArgs, U> {
    return new IO((...args) => f(this.runIO(...args)).runIO(...args))
  }
}
