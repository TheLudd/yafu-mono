import { assert } from 'chai'
import { it } from 'mocha'
import { ap, chain, map } from '@yafu/fantasy-functions'
import { Ask, Reader, readerOf, runReader } from '../lib/reader.js'

const { equal } = assert

const { ask } = Reader

const r1 = readerOf(1)
const inc = (n: number) => n + 1

it('retuns the inner value when run', () => {
  const result = runReader(r1, null)
  equal(result, 1)
})

it('implements functor', () => {
  const r2 = map(inc, r1)
  const result = runReader(r2, null)
  equal(result, 2)
})

it('implements apply', () => {
  const r2 = ap(readerOf(inc), r1)
  const result = runReader(r2, null)
  equal(result, 2)
})

it('implements chain', () => {
  const r2 = chain((x) => readerOf(x + 1), r1)
  const result = runReader(r2, null)
  equal(result, 2)
})

it('exposes ask', () => {
  function multiplyEnvBy(n: number) {
    return map((env: number) => env * n, ask as Ask<number>)
  }
  const result = runReader(chain(multiplyEnvBy, readerOf(2)), 3)
  equal(result, 6)
})
