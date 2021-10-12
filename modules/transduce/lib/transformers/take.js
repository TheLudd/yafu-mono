import {
  STEP,
  createTransformer,
  reduced,
  step,
} from './utils.js'

export default function take (n) {
  return (transformer) => {
    let count = 0
    return createTransformer(transformer, {
      [STEP] (acc, item) {
        const limitReached = count++ === n
        return limitReached
          ? reduced(acc)
          : step(transformer, acc, item)
      },
    })
  }
}
