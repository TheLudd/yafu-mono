import { assert } from 'chai'
import {
  createAssert as createAssertRTF,
  createRejectedAssert as createAssertRejectedRTF,
} from './asserts/rtf.js'
import {
  createAssert as createAssertParallel,
  createRejectedAssert as createAssertRejectedParallel,
} from './asserts/parallel.js'

const assertFunctions = Object.keys(assert)

const createAssertFactory = (assertWrapper) => assertFunctions.reduce((acc, item) => {
  acc[item] = assertWrapper(item)
  return acc
}, {})

export const assertRTF = createAssertFactory(createAssertRTF)
export const assertRejectedRTF = createAssertFactory(createAssertRejectedRTF)
export const assertParallel = createAssertFactory(createAssertParallel)
export const assertRejectedParallel = createAssertFactory(createAssertRejectedParallel)
