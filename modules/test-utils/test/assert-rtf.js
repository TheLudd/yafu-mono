import { AssertionError, assert } from 'chai'
import { describe, it } from 'mocha'
import { RTF, rtfOf } from '@yafu/reader-transforms'
import { reject } from '@yafu/parallel'
import { assertRTF } from '../lib/index.js'

const {
  equal,
  fail,
  isNotOk,
  ok,
  propertyVal,
} = assertRTF
const { instanceOf } = assert

describe('assertRtf', () => {
  const env = {}
  const rtf = rtfOf(1)
  function isAssertionError (e) {
    instanceOf(e, AssertionError)
  }

  describe('sucess', () => {
    it('equal', () => equal(env, rtf, 1))

    it('ok', () => ok(env, rtf))

    it('property val', () => {
      const objRtf = rtfOf({ foo: 'bar' })
      return propertyVal(env, objRtf, 'foo', 'bar')
    })
  })

  describe('failure', () => {
    it('equal', () => equal(env, rtf, 2).then(fail, isAssertionError))

    it('ok', () => isNotOk(env, rtf).then(fail, isAssertionError))

    it('property val', () => {
      const objRtf = rtfOf({ foo: 'bar' })
      return propertyVal(env, objRtf, 'foo', 'baz').then(fail, isAssertionError)
    })

    it('should fail on rtf errors', () => {
      const failingRTF = RTF.lift(reject(1))
      return equal(env, failingRTF)
        .then(fail)
        .catch((err) => assert.equal(err, 1))
    })
  })
})
