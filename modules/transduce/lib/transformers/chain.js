import {
  STEP,
  createTransformer,
  step,
} from './utils.js'

export default function chain (f) {
  return (transformer) => createTransformer(transformer, {
    [STEP] (acc, item) {
      const list = f(item)
      let out = acc
      for (let i = 0, len = list.length; i < len; i++) {
        out = step(transformer, out, list[i])
      }
      return out
    },
  })
}
