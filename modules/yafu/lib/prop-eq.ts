/**
 * Returns true if the specified object property is strictly equal to the given value
 *
 * @arg {String} name The object property name
 * @arg {*} val The value to look for
 * @arg {Object} o The object
 */
export function propEq(
  name: string,
  val: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  o: Record<string, any>,
): boolean {
  return o[name] === val
}
