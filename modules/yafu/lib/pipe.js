import callWith from './call-with.js'
import flip from './flip.js'
import reduce from './reduce.js'

/**
 * Pass a value through a list of function where the result of each
 * call is passed to the next function in the list.
 *
 * @arg list {[Function]} The list of functions to pass the argument through.
 * @arg x {any} The initial value, will be passed to the first function in the list.
 *
 */
const pipe = flip(reduce(callWith))

export default pipe
