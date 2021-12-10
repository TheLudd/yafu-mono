/**
 * Compose two functions passing the result from the second one to the first one.
 *
 * @function compose
 * @arg f {function} The function that will apply the return value of `g`
 * @arg g {function} The function that will be apply `x` and pass the result to `f`
 * @arg x {any} The value to pass to `g`
 */
export function compose <A, B, C> (f: (b: B) => C, g: (a: A) => B, x: A): C {
  return f(g(x))
}
