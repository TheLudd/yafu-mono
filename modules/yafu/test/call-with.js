export default (callWith) => () => {
  const inc = (n) => n + 1

  it('calls the function with the supplied argument', () => {
    callWith(1, inc).should.equal(2)
  })
}
