/**
 * Composes a binary function with a unary functon. The unary function will be
 * applied to the result of the binary function.
 *
 * @arg f {Function} A unary function
 * @arg g {Function} A binary function
 * @arg x {Any} The first value to pass to the binary function
 * @arg y {Any} The second value to pass to the binary function
 */
export function composeBinary<A, B, C, D>(
  f: (c: C) => D,
  g: (a: A, b: B) => C,
  x: A,
  y: B,
): D {
  return f(g(x, y))
}
