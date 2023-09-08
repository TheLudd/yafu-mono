import { assert } from 'chai'

const { fail } = assert

export function createAssert (key) {
  const assertFn = assert[key]
  function assertParallel (parallel, ...args) {
    return new Promise((resolve, reject) => {
      parallel.fork(reject, (result) => {
        const assertArgs = [ result, ...args ]
        try {
          assertFn(...assertArgs)
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    })
  }
  return assertParallel
}

export function createRejectedAssert (key) {
  const assertFn = assert[key]
  function assertParallel (parallel, ...args) {
    return new Promise((resolve, reject) => {
      parallel.fork((e) => {
        const assertArgs = [ e, ...args ]
        try {
          assertFn(...assertArgs)
          resolve()
        } catch (ae) {
          reject(ae)
        }
      }, (result) => {
        try {
          fail(result, null, 'Expected Parallel to be rejected')
        } catch (e) {
          reject(e)
        }
      })
    })
  }
  return assertParallel
}
