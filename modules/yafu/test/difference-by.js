export default (differenceBy) => () => {
  const getId = ({ id }) => id

  it('should return empty list for empty input lists', () => {
    differenceBy(getId, [], []).should.deep.equal([])
  })

  it('should return an empty list when there are no differences', () => {
    const a = [ { id: 1 }, { id: 2 } ]
    const b = [ { id: 1 }, { id: 2 }, { id: 1 } ]
    differenceBy(getId, a, b).should.deep.equal([])
  })

  it('should return an array of unique values not contained in the second array', () => {
    const a = [ { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 } ]
    const b = [ { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 } ]
    differenceBy(getId, a, b).should.deep.equal([ { id: 1 }, { id: 2 }, { id: 3 } ])
  })

  it('should handle duplicate values in the input lists', () => {
    const a = [ { id: 1 }, { id: 2 }, { id: 3 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 } ]
    const b = [ { id: 2 }, { id: 2 }, { id: 3 }, { id: 3 } ]
    differenceBy(getId, a, b).should.deep.equal([ { id: 1 }, { id: 4 } ])
  })
}
