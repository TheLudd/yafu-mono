export default (I) => () => {
  it('should return the argument it receives', () => {
    const someValue = {}
    I(someValue).should.equal(someValue)
  })
}
