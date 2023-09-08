import { assert } from 'chai'

const { fail } = assert

export function createAssert (key) {
  const assertFn = assert[key]
  function assertRTF (env, rtf, ...args) {
    return new Promise((resolve, reject) => {
      rtf.run(env).fork(reject, (result) => {
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
  return assertRTF
}

export function createRejectedAssert (key) {
  const assertFn = assert[key]
  function assertRTF (env, rtf, ...args) {
    return new Promise((resolve, reject) => {
      rtf.run(env).fork((e) => {
        const assertArgs = [ e, ...args ]
        try {
          assertFn(...assertArgs)
          resolve()
        } catch (ae) {
          reject(ae)
        }
      }, (result) => {
        try {
          fail(result, null, 'Expected RTF to fail')
        } catch (e) {
          reject(e)
        }
      })
    })
  }
  return assertRTF
}
