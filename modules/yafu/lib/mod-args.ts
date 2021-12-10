/**
 * Call a binary function after the arguments have been modified
 * by separate transform functions.
 *
 * @function modArgs
 * @arg f {function} A binary function
 * @arg g {function} Transform function for the first argument
 * @arg h {function} Transform function for the second argument
 * @arg x {any} The first agument to the binary function
 * @arg y {any} The second agument to the binary function
 */
export function modArgs <A, B, C, D, E> (
  f: (c: C, d: D) => E,
  g: (a: A) => C,
  h: (b: B) => D,
  x: A,
  y: B,
): E {
  return f(g(x), h(y))
}
