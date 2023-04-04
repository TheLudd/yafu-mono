export interface HKTMark {
  Type: unknown
  T: unknown
}

export interface HKT {
  hkt: HKTMark
}

type CallHKT<F extends HKTMark, ValueType> = (F & { T: ValueType })['Type']
export type Kind<T extends HKT, ValueType> = CallHKT<T['hkt'], ValueType>

export interface HKT2Mark extends HKTMark {
  U: unknown
}

export interface HKT2 extends HKT {
  hkt2: HKT2Mark
}

type CallHKT2<F extends HKT2Mark, LeftValueType, RightValueType> = (F & {
  U: LeftValueType
  T: RightValueType
})['Type']
export type Kind2<T extends HKT2, LeftValueType, RightValueType> = CallHKT2<
  T['hkt2'],
  LeftValueType,
  RightValueType
>
