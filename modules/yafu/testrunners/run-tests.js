import chai from 'chai'
import * as tests from '../test/index.js'

chai.should()

function shouldBeCurried (name, fn) {
  return name !== 'curry' && typeof fn === 'function'
}

export default function runTests (getTestSubject, testCurry = false) {
  return () => {
    Object.entries(tests).forEach(([ name, test ]) => {
      const fn = getTestSubject(name)
      describe(name, () => {
        if (testCurry && shouldBeCurried(name, fn)) {
          it('is curried', () => {
            fn().should.equal(fn())
            fn.should.equal(fn())
          })
        }
        test(fn)()
      })
    })
  }
}
