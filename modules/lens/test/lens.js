import { assert } from 'chai'
import { compose, curry } from 'yafu'
import {
  lens,
  over,
  set,
  view,
} from '../dist/es6/index.js'

const { deepEqual, equal } = assert

const assoc = curry((prop, val, obj) => ({ ...obj, [prop]: val }))
const prop = curry((propName, obj) => obj[propName])
const update = curry((index, val, array) => (
  array.map((item, i) => (i === index ? val : item))
))
const nth = curry((index, array) => array[index])

const propLens = curry((propName) => lens(prop(propName), assoc(propName)))
const indexLens = curry((index) => lens(nth(index), update(index)))
const headLens = indexLens(0)

const fooLens = propLens('foo')
const bazLens = propLens('baz')
const wutLens = propLens('wut')

const firstFooLens = compose(headLens, fooLens)
const firstWutLens = compose(headLens, wutLens)
const wutWutLens = compose(wutLens, wutLens)

const obj = { foo: 'bar', baz: 'QUX' }
const array = [ 'a', 'b', 'c' ]

const complex = [
  { foo: 'foo1' },
  { foo: 'foo2' },
  { foo: 'foo3' },
]

const toUpper = (s) => s.toUpperCase()

describe('lens', () => {
  describe('view', () => {
    it('returns the value in the focus', () => {
      equal('bar', view('def', fooLens, obj))
      equal('QUX', view('def', bazLens, obj))
      equal('a', view('def', headLens, array))
      equal('b', view('def', indexLens(1), array))
      equal('c', view('def', indexLens(2), array))
    })

    it('handles composed lenses', () => {
      equal('foo1', view('def', firstFooLens, complex))
    })

    it('returns the default value if the focus does not exist', () => {
      equal('def', view('def', firstWutLens, obj))
      equal('def', view('def', wutWutLens, complex))
    })
  })

  describe('over', () => {
    it('modifies the value in the focus', () => {
      deepEqual({ ...obj, foo: 'BAR' }, over(fooLens, toUpper, obj))
      deepEqual([ 'A', 'b', 'c' ], over(headLens, toUpper, array))
      deepEqual([ 'a', 'B', 'c' ], over(indexLens(1), toUpper, array))
      deepEqual([ 'a', 'b', 'C' ], over(indexLens(2), toUpper, array))
    })

    it('returns the exact same object if the focus is unchanged', () => {
      equal(obj, over(bazLens, toUpper, obj))
    })

    it('handles composed lenses', () => {
      const expected = [
        { foo: 'FOO1' },
        { foo: 'foo2' },
        { foo: 'foo3' },
      ]
      deepEqual(expected, over(firstFooLens, toUpper, complex))
    })

    it('returns the exact same object if the focus does not exist', () => {
      equal(obj, over(wutLens, toUpper, obj))
      equal(obj, over(firstWutLens, toUpper, obj))
      equal(obj, over(wutWutLens, toUpper, obj))
    })
  })

  describe('set', () => {
    it('updates the value in the focus', () => {
      deepEqual({ ...obj, foo: 'new' }, set(fooLens, 'new', obj))
      deepEqual({ ...obj, baz: 'new' }, set(bazLens, 'new', obj))
      deepEqual([ 'new', 'b', 'c' ], set(headLens, 'new', array))
      deepEqual([ 'a', 'new', 'c' ], set(indexLens(1), 'new', array))
      deepEqual([ 'a', 'b', 'new' ], set(indexLens(2), 'new', array))
    })

    it('handles composed lenses', () => {
      const expected = [
        { foo: 'bar1' },
        { foo: 'foo2' },
        { foo: 'foo3' },
      ]
      deepEqual(expected, set(firstFooLens, 'bar1', complex))
    })

    it('returns the exact same object if the focus is unchanged', () => {
      equal(obj, set(fooLens, 'bar', obj))
      equal(obj, set(firstWutLens, toUpper, obj))
      equal(complex, set(firstWutLens, toUpper, complex))
    })
  })
})
