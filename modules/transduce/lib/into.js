import { curry } from '@yafu/curry'
import { init } from './transformers/utils.js'
import runTransduce from './run-transduce.js'

function into (transformer, transducer, iterable) {
  return runTransduce(transducer, transformer, init(transformer), iterable)
}

export default curry(into)
