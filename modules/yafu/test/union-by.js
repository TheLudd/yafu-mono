import { I } from '../dist/i.js'

export default function (unionBy) {
  return function () {
    it('it returns union of 2 arrays', () => {
      unionBy(I, [ 'a', 'b', 'c' ], [ 'c', 'd', 'e' ]).should.deep.equal([ 'a', 'b', 'c', 'd', 'e' ])
    })

    it('handles applied func', () => {
      unionBy((a) => a.toUpperCase(), [ 'a', 'b', 'c' ], [ 'C', 'd', 'e' ]).should.deep.equal([ 'a', 'b', 'c', 'd', 'e' ])
    })

    it('handles duplicate in first array', () => {
      unionBy(I, [ 'a', 'b', 'b', 'c' ], [ 'c', 'd', 'e' ]).should.deep.equal([ 'a', 'b', 'c', 'd', 'e' ])
    })

    it('handles duplicates in second array', () => {
      unionBy(I, [ 'a', 'b', 'c' ], [ 'c', 'd', 'd', 'e' ]).should.deep.equal([ 'a', 'b', 'c', 'd', 'e' ])
    })

    it('handles both empty arrays', () => {
      unionBy(I, [], []).should.deep.equal([])
    })

    it('handles first empty array', () => {
      unionBy(I, [], [ 'c', 'd', 'e' ]).should.deep.equal([ 'c', 'd', 'e' ])
    })

    it('handles second empty array', () => {
      unionBy(I, [ 'a', 'b', 'c' ], []).should.deep.equal([ 'a', 'b', 'c' ])
    })
  }
}
