import { arrayToSet } from '../dist/_arrayToSet.js'
import { setToArray } from '../dist/_setToArray.js'

/**
 * Creates a new list of unique elements that are common to both lists using {@link http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero SameValueZero}
 * for equality comparisons.
 *
 * @function intersection
 * @arg {Array} list1  The first list
 * @arg {Array} list2  The second list
 * @return {Array} The list of elements common to both list
 *
 */
export function intersection<A>(list1: A[], list2: A[]): A[] {
  let listToIterate
  let lookupSet
  if (list1.length >= list2.length) {
    listToIterate = list2
    lookupSet = arrayToSet(list1)
  } else {
    listToIterate = list1
    lookupSet = arrayToSet(list2)
  }

  const out = new Set<A>()
  for (let i = 0; i < listToIterate.length; i++) {
    const item = listToIterate[i]
    if (lookupSet.has(item)) {
      out.add(item)
    }
  }

  return setToArray(out)
}
