import { init } from './transformers/utils'
import runTransduce from './run-transduce'

export default function into (transformer, transducer, iterable) {
  return runTransduce(transducer, transformer, init(transformer), iterable)
}
