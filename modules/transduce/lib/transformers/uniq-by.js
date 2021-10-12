import {
  STEP,
  createTransformer,
  step,
} from './utils.js'

export default function uniqBy (f) {
  return (transformer) => {
    const valueSet = new Set()
    return createTransformer(transformer, {
      [STEP] (acc, item) {
        const key = f(item)
        if (valueSet.has(key)) return acc

        valueSet.add(key)
        return step(transformer, acc, item)
      },
    })
  }
}
