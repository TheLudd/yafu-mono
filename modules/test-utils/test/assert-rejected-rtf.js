import { AssertionError, assert } from 'chai'
import { describe, it } from 'mocha'
import { RTF, rtfOf } from '@yafu/reader-transforms'
import { reject } from '@yafu/parallel'
import { assertRejectedRTF } from '../lib/index.js'

const {
  equal,
  fail,
  isNotOk,
  ok,
  propertyVal,
} = assertRejectedRTF
const { instanceOf } = assert

describe('assertRejectedRtf', () => {
  const env = {}
  function rejectRTF (error) {
    return RTF.lift(reject(error))
  }
  const rtf = rejectRTF('The error')
  function isAssertionError (e) {
    instanceOf(e, AssertionError)
  }

  describe('sucess', () => {
    it('equal', () => equal(env, rtf, 'The error'))

    it('ok', () => ok(env, rtf))

    it('property val', () => {
      const objRtf = rejectRTF({ foo: 'bar' })
      return propertyVal(env, objRtf, 'foo', 'bar')
    })
  })

  describe('failure', () => {
    it('equal', () => equal(env, rtf, 'Incorrect error').then(fail, isAssertionError))

    it('ok', () => isNotOk(env, rtf).then(fail, isAssertionError))

    it('property val', () => {
      const objRtf = rejectRTF({ foo: 'bar' })
      return propertyVal(env, objRtf, 'foo', 'baz').then(fail, isAssertionError)
    })

    it('should fail if rtf succeeds', () => {
      const workingRTF = rtfOf(1)
      return equal(env, workingRTF, 1).then(fail, isAssertionError)
    })
  })
})
