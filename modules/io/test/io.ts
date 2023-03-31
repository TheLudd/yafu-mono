import { assert } from 'chai'
import { chain, map, of } from '@yafu/fantasy-functions'
import { IO, runIO, runIO1 } from '../lib/io.js'

const { deepEqual, equal } = assert

const state = {
  bar: 'the string bar',
  foo: 'the string foo',
}

const getStateIO = new IO((key: keyof typeof state) => state[key])

const nowIO = new IO(() => new Date())

function getFullYear(d: Date) {
  return d.getFullYear()
}

describe('io', () => {
  const ioOf = of(IO)
  const addIntoIO = (x: number) => ioOf(x + 1)

  it('should chain', () => {
    const result = runIO(chain(addIntoIO, ioOf(1)))
    equal(result, 2)
  })

  it('should run with one', () => {
    const result = runIO1('foo', getStateIO)
    equal(result, 'the string foo')
  })

  it('should chain properly', () => {
    const resultArray: number[] = []
    function addToArray(v: number) {
      return new IO((arr: number[]) => {
        arr.push(v)
        return arr
      })
    }
    const fullYearIO = map(getFullYear, nowIO)
    const testIO = chain(addToArray, fullYearIO)
    runIO1(resultArray, testIO)
    deepEqual(resultArray, [new Date().getFullYear()])
  })
})
