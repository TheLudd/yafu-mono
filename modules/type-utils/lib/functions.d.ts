export type Unary<A, B> = (a: A) => B
export type Binary<A, B, C> = (a: A, b: B) => C

export type Predicate<T> = Unary<T, boolean>
export type Fold<A, B> = Binary<B, A, B>
