export default (clamp) => () => {
  it('clamps to the lower bound', () => {
    clamp(1, 100, -100).should.equal(1)
  })

  it('clamps to the upper bound', () => {
    clamp(1, 100, 200).should.equal(100)
  })

  it('does not clamp when in range', () => {
    clamp(100, 200, 150).should.equal(150)
  })
}
