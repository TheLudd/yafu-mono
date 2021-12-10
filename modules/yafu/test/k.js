export default (K) => () => {
  it('should return the first of the two arguments', () => {
    const obj1 = {}
    const obj2 = []
    K(obj1, obj2).should.equal(obj1)
  })
}
