export default (all) => () => {
  const getFalse = () => false
  const isNumber = (n) => typeof n === 'number'

  it('returns true for an empty array', () => {
    all(getFalse, []).should.equal(true)
  })

  it('returns true if all elements pass the predicate test', () => {
    all(isNumber, [ 1, 2, 3 ]).should.equal(true)
  })

  it('returns false if any element fails the predicate test', () => {
    all(isNumber, [ 1, '2', 3 ]).should.equal(false)
  })
}
