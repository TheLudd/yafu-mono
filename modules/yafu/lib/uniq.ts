import { I } from '../dist/i.js'
import { uniqBy } from '../dist/uniq-by.js'

/**
 * Returns a new list without duplicate elements.
 * {@link http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero SameValueZero} is used for equality comparisons
 *
 * @function uniq
 * @arg {Array} list The list to inspect
 * @return {Array} A new list of unique elements
 */
export const uniq = uniqBy(I)
