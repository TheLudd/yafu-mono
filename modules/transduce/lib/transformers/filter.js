import {
  STEP,
  createTransformer,
  step,
} from './utils.js'

export default function filter (pred) {
  return (transformer) => createTransformer(transformer, {
    [STEP] (acc, item) {
      return pred(item)
        ? step(transformer, acc, item)
        : acc
    },
  })
}
