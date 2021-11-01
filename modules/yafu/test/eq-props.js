export default function (eqProps) {
  return function () {
    it('returns true for two equal values on object prop', () => {
      eqProps('a', { a: 1 }, { a: 1 }).should.equal(true)
      eqProps('a', { a: 'foo' }, { a: 'foo' }).should.equal(true)
      eqProps('a', { a: 0 }, { a: 0 }).should.equal(true)
    })

    it('should return false for two non equal values', () => {
      eqProps('a', { a: 1 }, { a: 2 }).should.equal(false)
      eqProps('a', { a: 'foo' }, { a: 'Foo' }).should.equal(false)
      eqProps('a', { a: 0 }, { a: '0' }).should.equal(false)
      eqProps('a', { a: [] }, { a: [] }).should.equal(false)
    })

    it('handles not found props', () => {
      eqProps('a', { a: 1 }, { b: 1 }).should.equal(false)
      eqProps('a', { b: 1 }, { a: 1 }).should.equal(false)
    })

    it('handles both not found props', () => {
      eqProps('a', { b: 1 }, { b: 1 }).should.equal(true)
    })
  }
}
