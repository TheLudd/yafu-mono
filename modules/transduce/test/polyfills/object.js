import { assert } from 'chai'
import { into, map } from '../../index.js'
import '../../lib/polyfills/object.js'

const { deepEqual, notEqual } = assert

const makeKeyValue = (value) => ({ [value]: value })

describe('set', () => {
  const sampleArray = [ 'foo', 'bar' ]

  it('merges the different objects produced by the transducer', () => {
    const result = into({}, map(makeKeyValue), sampleArray)
    const expected = { foo: 'foo', bar: 'bar' }
    deepEqual(result, expected)
  })

  it('adds to the initial object', () => {
    const initial = { some: 'value' }
    const result = into(initial, map(makeKeyValue), sampleArray)
    const expected = { foo: 'foo', bar: 'bar', some: 'value' }
    deepEqual(result, expected)
    notEqual(result, initial)
  })

  it('overwrites values produced later in the sequence', () => {
    const arrayWithDuplicates = [ 'foo', 'bar', 'foo', 'baz' ]
    let count = 0
    function makeCountingValue (value) {
      return { [value]: ++count }
    }
    const result = into({ baz: 'initial' }, map(makeCountingValue), arrayWithDuplicates)
    const expected = { foo: 3, bar: 2, baz: 4 }
    deepEqual(result, expected)
  })
})
