import { it } from 'mocha'
import { alt, ap, chain, map, of } from '@yafu/fantasy-functions'
import { assert } from 'chai'
import { RTE, rteOf } from '../lib/index.js'
import { cata, left } from '@yafu/either'

const rte1 = of(RTE, 1)

const inc = (x: number) => x + 1

function getValue(ri: RTE<unknown, number, number>, env = 0): number {
  return cata(
    () => NaN,
    (x) => x,
    ri.run(env),
  )
}

it('implements functor', () => {
  const result = getValue(map(inc, rte1))
  assert.equal(result, 2)
})

it('implements applicative', () => {
  const riInc = rteOf(inc)
  const result = getValue(ap(riInc, rte1))
  assert.equal(result, 2)
})

it('implements alt', () => {
  const failing = RTE.lift(left('error'))
  const result = getValue(alt(rte1, failing))
  assert.equal(result, 1)
})

it('implements chain', () => {
  const incRI = (x: number) => rteOf(inc(x))
  const result = getValue(chain(incRI, rte1))
  assert.equal(result, 2)
})

it('exposes ask', () => {
  function incEnvWith(x: number): RTE<never, number, number> {
    return map((env) => env + x, RTE.ask as RTE.Ask<number>)
  }

  const result = getValue(chain(incEnvWith, rte1), 1)
  assert.equal(result, 2)
})
