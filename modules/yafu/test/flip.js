export default (flip) => () => {
  const strConcat = (a, b) => a + b

  it('flips the arguments to the passed in function', () => {
    flip(strConcat, 'foo', 'bar').should.equal('barfoo')
  })
}
