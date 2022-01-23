export interface HKTMark {
  Type: unknown,
  T: unknown,
}

export interface HKT {
  hkt: HKTMark
}

type CallHKT<F extends HKTMark, I> = (F & { T: I })['Type']
export type Kind<T extends HKT, U> = CallHKT<T['hkt'], U>

export interface HKT2Mark extends HKTMark {
  U: unknown,
}

export interface HKT2 extends HKT {
  hkt2: HKT2Mark
}

type CallHKT2<F extends HKT2Mark, A, B> = (F & { T: A, U: B })['Type']
export type Kind2<T extends HKT2, A, B> = CallHKT2<T['hkt2'], A, B>

