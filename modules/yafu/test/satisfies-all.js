export default (satisfiesAll) => () => {
  const isNumber = (n) => typeof n === 'number'
  const isOdd = (n) => n % 2 === 1

  it('returns true for an empty list of predicates', () => {
    satisfiesAll([], 'foo').should.equal(true)
  })

  it('returns true for a list of predicates that all return true for the value', () => {
    satisfiesAll([ isNumber, isOdd ], 3).should.equal(true)
  })

  it('returns false for a list of predicates where at leas one return false for the value', () => {
    satisfiesAll([ isNumber, isOdd ], 4).should.equal(false)
  })
}
