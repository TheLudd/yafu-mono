/**
 * Creates a new list of unique values that are included in the first list but
 * not in the second list. Uniqueness is determined by applying the supplied
 * function to each list element. If the supplied function produces identical values for
 * multiple list elements only the first element is kept.
 *
 * @function differenceBy
 * @arg {Function} createKey A function to produce the value used to determine uniqueness.
 * @arg {Array} list1  The first list
 * @arg {Array} list2  The second list
 * @return {Array} A list of unique elements in list1 that are not in list2
 *
 */
export function differenceBy<T>(
  createKey: (item: T) => string,
  list1: T[],
  list2: T[],
): T[] {
  const lookupSet = new Set<string>()
  for (let i = 0; i < list2.length; i++) {
    const item = list2[i]
    const key = createKey(item)
    lookupSet.add(key)
  }

  const out: T[] = []
  for (let i = 0; i < list1.length; i++) {
    const item = list1[i]
    const key = createKey(item)
    if (!lookupSet.has(key)) {
      out.push(item)
      lookupSet.add(key)
    }
  }

  return out
}
