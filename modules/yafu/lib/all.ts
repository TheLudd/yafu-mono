/**
 * Apply a predicate function to every element in a list and return `true`
 * unless at least of one of the elements yields the result `false`.
 *
 * @arg predicate {Function} The predicate function
 * @arg list {Array} The list of elements to check
 */
export function all <A> (predicate: (a: A) => boolean, list: A[]): boolean {
  return list.length === 0 || (predicate(list[0]) === true && all(predicate, list.slice(1)))
}
