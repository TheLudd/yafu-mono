/**
 * Applies a binary function to the supplied arguments.
 *
 * @function callBinaryWith
 * @arg x {any} The first agument to the binary function
 * @arg y {any} The second agument to the binary function
 * @arg f {function} A unary function
 */
export function callBinaryWith<A, B, C>(x: A, y: B, f: (a: A, b: B) => C): C {
  return f(x, y)
}
