/**
 * Applies a unary function to the supplied argument.
 *
 * @function callWith
 * @arg x {any} The agument to the unary function
 * @arg f {function} A unary function
 */
export function callWith <A, B> (x: A, f: (a: A) => B): B {
  return f(x)
}
