import { Either } from '@yafu/either'
import { IO } from '@yafu/io'
import { Parallel } from '@yafu/parallel'
import { RIO, RTE, RTF } from './index.js'

export declare function run<E, T, Env>(r: RTE<E, T, Env>, env: Env): Either<E, T>
export declare function run<E, T, Env>(r: RTF<E, T, Env>, env: Env): Parallel<E, T>
export declare function run<T, IOArgs extends unknown[], Env>(r: RIO<T, IOArgs, Env>, env: Env): IO<IOArgs, T>
