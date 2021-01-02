import { curry } from 'yafu'
import { RESULT, STEP } from './transformers/utils'
import runTransduce from './run-transduce'

function createReducer (fn) {
  return {
    [STEP] (acc, item) {
      return fn(acc, item)
    },
    [RESULT] (acc) {
      return acc
    },
  }
}

function transduce (transformer, fn) {
  const reducer = createReducer(fn)
  return (acc, transducible) => runTransduce(transformer, reducer, acc, transducible)
}

export default curry(transduce)
