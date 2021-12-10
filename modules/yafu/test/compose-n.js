export default (composeN) => () => {
  const add = (x, y) => x + y
  const mulBy2 = (x) => x * 2

  it('should apply the function of length n to the input and the unary to the result', () => {
    composeN(2, mulBy2, add, 10, 20).should.equal(60)
  })
}
