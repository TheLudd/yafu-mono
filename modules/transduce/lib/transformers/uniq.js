import {
  STEP,
  createTransformer,
  step,
} from './utils.js'

export default function uniqBy (transformer) {
  const valueSet = new Set()
  return createTransformer(transformer, {
    [STEP] (acc, item) {
      if (valueSet.has(item)) return acc

      valueSet.add(item)
      return step(transformer, acc, item)
    },
  })
}
