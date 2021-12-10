export default (compose) => () => {
  const inc = (n) => n + 1
  const dbl = (n) => n * 2

  it('composes right to left', () => {
    compose(inc, dbl, 20).should.equal(41)
    compose(dbl, inc, 20).should.equal(42)
  })
}
