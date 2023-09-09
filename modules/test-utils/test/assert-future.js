import { AssertionError, assert } from 'chai'
import { describe, it } from 'mocha'
import { parallelOf, reject } from '@yafu/parallel'
import { assertParallel } from '../lib/index.js'

const {
  equal,
  fail,
  isNotOk,
  ok,
  propertyVal,
} = assertParallel
const { instanceOf } = assert

describe('assertParallel', () => {
  const p = parallelOf(1)
  function isAssertionError (e) {
    instanceOf(e, AssertionError)
  }

  describe('sucess', () => {
    it('equal', () => equal(p, 1))

    it('ok', () => ok(p))

    it('property val', () => {
      const objRtf = parallelOf({ foo: 'bar' })
      return propertyVal(objRtf, 'foo', 'bar')
    })
  })

  describe('failure', () => {
    it('equal', () => equal(p, 2).then(fail, isAssertionError))

    it('ok', () => isNotOk(p).then(fail, isAssertionError))

    it('property val', () => {
      const objRtf = parallelOf({ foo: 'bar' })
      return propertyVal(objRtf, 'foo', 'baz').then(fail, isAssertionError)
    })

    it('should fail on rtf errors', () => {
      const failingFuture = reject(1)
      return equal(failingFuture)
        .then(fail)
        .catch((err) => assert.equal(err, 1))
    })
  })
})
