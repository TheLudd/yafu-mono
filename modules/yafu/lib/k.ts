/**
 * A binary function that returns its' first argument.
 *
 * @arg x {any} The first value, will be returned.
 * @arg y {any} The second value, will be ignored.
 *
 */
export function K <A, B> (x: A, _y: B): A {
  return x
}
