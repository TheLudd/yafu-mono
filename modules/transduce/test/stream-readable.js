import { I } from 'yafu'
import { assert } from 'chai'
import { Readable } from 'stream'
import '../lib/stream-readable.js'
import into from '../lib/into.js'
import map from '../lib/transformers/map.js'
import take from '../lib/transformers/take.js'
import filter from '../lib/transformers/filter.js'
import chain from '../lib/transformers/chain.js'

const { deepEqual } = assert
const inc = (x) => x + 1
const isOdd = (x) => x % 2 === 1

function createArrayStream (array) {
  return new Readable({
    objectMode: true,
    read () {
      array.forEach((d) => this.push(d))
      this.push(null)
    },
  })
}

const emptyStream = createArrayStream([])

function assertStreamResult (stream, expected, done) {
  const arrayResult = into([], I, stream)
  stream.on('end', () => {
    deepEqual(arrayResult, expected)
    done()
  })
  stream.on('error', done)
}

it('stream to array', (done) => {
  const str = createArrayStream([ 1, 2 ])
  const result = into([], map(inc), str)
  str.on('end', () => {
    deepEqual(result, [ 2, 3 ])
    done()
  })
})

it('array to stream', (done) => {
  const result = into(emptyStream, map(inc), [ 1, 2 ])
  assertStreamResult(result, [ 2, 3 ], done)
})

it('stream to stream', (done) => {
  const result = into(emptyStream, map(inc), createArrayStream([ 1, 2 ]))
  assertStreamResult(result, [ 2, 3 ], done)
})

it('stream to non empty stream', (done) => {
  const str = createArrayStream([ 1, 2 ])
  const result = into(createArrayStream([ 'a', 'b' ]), map(inc), str)
  assertStreamResult(result, [ 'a', 'b', 2, 3 ], done)
})

it('reduced', (done) => {
  const str = createArrayStream([ 1, 2, 3, 4 ])
  const result = into(emptyStream, take(2), str)
  assertStreamResult(result, [ 1, 2 ], done)
})

it('filter', (done) => {
  const str = createArrayStream([ 1, 2, 3, 4 ])
  const result = into(emptyStream, filter(isOdd), str)
  assertStreamResult(result, [ 1, 3 ], done)
})

it('chain', (done) => {
  const getTags = ({ tags }) => tags

  const list = [
    { tags: [ 'a', 'b', 'c' ] },
    { tags: [ 'd', 'e', 'f' ] },
  ]

  const str = createArrayStream(list)
  const result = into(emptyStream, chain(getTags), str)
  assertStreamResult(result, [ 'a', 'b', 'c', 'd', 'e', 'f' ], done)
})
