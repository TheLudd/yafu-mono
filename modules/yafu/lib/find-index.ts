/**
 * Returns the index of the first item in a list that matches a predicate.
 * If no item matches, -1 is returned.
 *
 * @arg pred {function} A predicate function
 * @arg list {Array} The list to find the element in.
 */
export function findIndex <T> (pred: (a: T) => boolean, list: T[]): number {
  let i
  for (i = 0; i < list.length; i++) {
    if (pred(list[i])) {
      return i
    }
  }
  return -1
}
