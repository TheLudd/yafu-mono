export default (reduce) => () => {
  const add = (a, b) => a + b

  it('returns the initial argument for an empty list', () => {
    reduce(null, 'X', []).should.equal('X')
  })

  it('performs the reduce operation on the array', () => {
    reduce(add, 0, [ 1, 2, 3 ]).should.equal(6)
  })
}
