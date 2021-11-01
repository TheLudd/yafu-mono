import curry from './curry.js'

/**
 * Check for equality with using the === binary operator of props.
 */
function eqProps (prop, a, b) {
  return a[prop] === b[prop]
}

export default curry(eqProps)
