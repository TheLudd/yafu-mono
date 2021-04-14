import curry from './curry.js'

/**
 * Check for non equality with using the !== binary operator.
 */
function _neq (a, b) {
  return a !== b
}

export default curry(_neq)
