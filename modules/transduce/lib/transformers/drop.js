import {
  STEP,
  createTransformer,
  step,
} from './utils.js'

export default function drop (n) {
  return (transformer) => {
    let count = 0
    return createTransformer(transformer, {
      [STEP] (acc, item) {
        const limitReached = count++ >= n
        return limitReached
          ? step(transformer, acc, item)
          : acc
      },
    })
  }
}
