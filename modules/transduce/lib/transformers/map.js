import {
  STEP,
  createTransformer,
  step,
} from './utils'

export default function map (f) {
  return (transformer) => createTransformer(transformer, {
    [STEP] (acc, item) {
      return step(transformer, acc, f(item))
    },
  })
}
