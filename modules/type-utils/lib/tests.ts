export type HKTMark = {
  Type: unknown
  T: unknown
}

export interface HKT {
  hkt: HKTMark
}

type CallHKT<F extends HKTMark, I> = (F & { T: I })['Type']
export type Kind<T extends HKT, U> = CallHKT<T['hkt'], U>

export type HKT2Mark = {
  Type: unknown
  T: unknown
  U: unknown
}

export interface HKT2 {
  hkt: HKT2Mark
}

type CallHKT2<F extends HKT2Mark, A, B> = (F & { T: A; U: B })['Type']
export type Kind2<T extends HKT2, A, B> = CallHKT2<T['hkt'], A, B>
