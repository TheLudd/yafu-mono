import { init } from './transformers/utils.js'
import runTransduce from './run-transduce.js'

export default function into (transformer, transducer, iterable) {
  return runTransduce(transducer, transformer, init(transformer), iterable)
}
