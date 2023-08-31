import { ap, chain, map, of } from 'fantasy-land'
import '@yafu/fantasy-functions'
import { HKT, HKTMark } from '@yafu/type-utils'

interface IOHKTMark extends HKTMark {
  Type: IO<unknown[], this['T']>
}

export function runIO2<A, B, T>(a: A, b: B, io: IO<[A, B], T>) {
  return io.run(a, b)
}

export function runIO1<A, T>(a: A, io: IO<[A], T>) {
  return io.run(a)
}

export function runIO<T>(io: IO<[], T>) {
  return io.run()
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

  readonly run

  constructor(run: (...args: RunArgs) => T) {
    this.run = run
  }

  [map]<U>(f: (v: T) => U): IO<RunArgs, U> {
    return new IO((...args) => f(this.run(...args)))
  }

  [ap]<U>(b: IO<RunArgs, (v: T) => U>): IO<RunArgs, U> {
    return new IO((...args) => b.run(...args)(this.run(...args)))
  }

  [chain]<U>(f: (v: T) => IO<RunArgs, U>): IO<RunArgs, U> {
    return new IO((...args) => f(this.run(...args)).run(...args))
  }
}
