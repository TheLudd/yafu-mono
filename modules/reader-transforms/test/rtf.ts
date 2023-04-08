import { it } from 'mocha'
import { ap, chain, map, of } from '@yafu/fantasy-functions'
import { assert } from 'chai'
import { RTF, rtfOf } from '../lib/index.js'

const rtf1 = of(RTF, 1)

const inc = (x: number) => x + 1

function getValue(ri: RTF<never, number, number>, env = 0): number {
  const future = ri.run(env)
  let result = NaN
  future.fork(
    (e) => {
      throw e
    },
    (a) => {
      result = a
    },
  )
  return result
}

it('implements functor', () => {
  const result = getValue(map(inc, rtf1))
  assert.equal(result, 2)
})

it('implements applicative', () => {
  const riInc = rtfOf(inc)
  const result = getValue(ap(riInc, rtf1))
  assert.equal(result, 2)
})

it('implements chain', () => {
  const incRI = (x: number) => rtfOf(inc(x))
  const result = getValue(chain(incRI, rtf1))
  assert.equal(result, 2)
})

it('exposes ask', () => {
  function incEnvWith(x: number): RTF<never, number, number> {
    return map((env) => env + x, RTF.ask as RTF.Ask<number>)
  }

  const result = getValue(chain(incEnvWith, rtf1), 1)
  assert.equal(result, 2)
})
