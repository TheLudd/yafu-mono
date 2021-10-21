import { assert } from 'chai'
import { Readable, Writable } from 'stream'
import '../../lib/polyfills/writable.js'
import '../../lib/polyfills/readable.js'
import into from '../../lib/into.js'
import map from '../../lib/transformers/map.js'

const { deepEqual } = assert
const inc = (x) => x + 1

function createArrayStream (array) {
  return new Readable({
    objectMode: true,
    read () {
      array.forEach((d) => this.push(d))
      this.push(null)
    },
  })
}

describe('streamWitable', () => {
  const results = []

  beforeEach(() => {
    results.splice(0)
  })

  function createResultsWriter () {
    return new Writable({
      objectMode: true,
      write (d, _, cb) {
        results.push(d)
        cb()
      },
    })
  }

  it('works', (done) => {
    const writer = createResultsWriter()
    into(writer, map(inc), createArrayStream([ 1, 2 ]))
    writer.on('finish', () => {
      deepEqual(results, [ 2, 3 ])
      done()
    })
  })
})
