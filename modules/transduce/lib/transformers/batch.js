import {
  STEP,
  RESULT,
  createTransformer,
  step,
} from './utils.js'

export default function batch (n) {
  return (transformer) => {
    let count = 0
    let nextBatch = []
    return createTransformer(transformer, {
      [STEP] (acc, item) {
        nextBatch.push(item)
        if (++count < n) {
          return acc
        }
        count = 0
        const toSend = nextBatch
        nextBatch = []
        return step(transformer, acc, toSend)
      },
      [RESULT] (acc) {
        return count > 0
          ? step(transformer, acc, nextBatch)
          : acc
      },
    })
  }
}
