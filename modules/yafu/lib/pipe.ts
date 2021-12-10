import { callWith } from '../dist/call-with.js'
import { flip } from '../dist/flip.js'
import { reduce } from '../dist/reduce.js'

/**
 * Pass a value through a list of function where the result of each
 * call is passed to the next function in the list.
 *
 * @arg list {[Function]} The list of functions to pass the argument through.
 * @arg x {any} The initial value, will be passed to the first function in the list.
 *
 */
export const pipe = flip(reduce(callWith))
