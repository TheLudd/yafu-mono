import { AssertionError, assert } from 'chai'
import { describe, it } from 'mocha'
import { reject, parallelOf } from '@yafu/parallel'
import { assertRejectedParallel } from '../lib/index.js'

const {
  equal,
  fail,
  isNotOk,
  ok,
  propertyVal,
} = assertRejectedParallel
const { instanceOf } = assert

describe('assertRejectedParallel', () => {
  const future = reject('The error')

  function isAssertionError (e) {
    instanceOf(e, AssertionError)
  }

  describe('sucess', () => {
    it('equal', () => equal(future, 'The error'))

    it('ok', () => ok(future))

    it('property val', () => {
      const objFuture = reject({ foo: 'bar' })
      return propertyVal(objFuture, 'foo', 'bar')
    })
  })

  describe('failure', () => {
    it('equal', () => equal(future, 'Incorrect error').then(fail, isAssertionError))

    it('ok', () => isNotOk(future).then(fail, isAssertionError))

    it('property val', () => {
      const objFuture = reject({ foo: 'bar' })
      return propertyVal(objFuture, 'foo', 'baz').then(fail, isAssertionError)
    })

    it('should fail if future succeeds', () => {
      const workingFuture = parallelOf(1)
      return equal(workingFuture, 1).then(fail, isAssertionError)
    })
  })
})
