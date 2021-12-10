/**
 * Returns a new list union of 2 lists duplicate elements. Uniqueness is determined by applying
 * the supplied function to each list element. If the supplied function produces
 * identical values for multiple list elements only the first element is kept.
 * The order of result values is determined by the order they occur in the input list.
 * {@link http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero SameValueZero} is used for equality comparisons
 *
 * @function unionBy
 * @arg {Function} fn A function to produce the value used to determine uniqueness
 * @arg {Array} list The list original
 * @arg {Array} list The list to merge
 * @return {Array} A new list of unique elements
 */

export function unionBy <A, B>(fn: (a: A) => B, list1: A[], list2: A[]): A[] {
  const set = new Set()
  const out = []
  for (let i = 0; i < list1.length; i++) {
    const listItem = list1[i]
    const val = fn(listItem)
    if (!set.has(val)) {
      out.push(listItem)
      set.add(val)
    }
  }

  for (let i = 0; i < list2.length; i++) {
    const listItem = list2[i]
    const val = fn(listItem)
    if (!set.has(val)) {
      out.push(listItem)
      set.add(val)
    }
  }
  return out
}
