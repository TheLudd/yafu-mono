export const TRANSDUCE = '@@transduce'
export const STEP = '@@transduce/step'
export const RESULT = '@@transduce/result'
export const INIT = '@@transduce/init'
export const REDUCED = '@@transduce/reduced'
export const VALUE = '@@transduce/value'

export function isTransformer (obj) {
  return obj[INIT] != null
}

export function isReduced (obj) {
  return obj[REDUCED] === true
}

export function value (obj) {
  return obj[VALUE]
}

export const step = (transformer, acc, item) => transformer[STEP](acc, item)

export const init = (transformer) => transformer[INIT]()

export const result = (transformer, acc) => transformer[RESULT](acc)

function createBaseTransformer (nextTransformer) {
  return {
    [INIT] () {
      return init(nextTransformer)
    },
    [STEP] (acc, item) {
      return step(nextTransformer, acc, item)
    },
    [RESULT] (acc) {
      return result(nextTransformer, acc)
    },
  }
}

export function createTransformer (nextTransformer, spec) {
  return { ...createBaseTransformer(nextTransformer), ...spec }
}

export function reduced (obj) {
  return {
    [REDUCED]: true,
    [VALUE]: obj,
  }
}
