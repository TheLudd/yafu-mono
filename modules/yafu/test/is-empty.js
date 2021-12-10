export default (isEmpty) => () => {
  it('should return true for an empty array', () => {
    isEmpty([]).should.equal(true)
  })

  it('should return false for a non empty array', () => {
    isEmpty([ 1 ]).should.equal(false)
  })
}
