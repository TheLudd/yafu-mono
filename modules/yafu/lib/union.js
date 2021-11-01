import unionBy from './union-by.js'
import I from './i.js'

/**
 * Returns a list of unique values composed of elements from each input list using
 * {@link http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero SameValueZero} for equality comparisons.
 *
 * @function union
 * @arg {Array} list1 The first list
 * @arg {Array} list2 The second list
 * @return {Array} A new list of unique elements
 *
 */
const union = unionBy(I)

export default union
