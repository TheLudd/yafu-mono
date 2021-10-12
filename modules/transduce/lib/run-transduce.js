import { TRANSDUCE } from './transformers/utils.js'

export default function runTransduce (transformer, reducer, initial, transducible) {
  return transducible[TRANSDUCE](transformer(reducer), initial)
}
