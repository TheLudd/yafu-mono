import { it } from 'mocha'
import { ap, chain, extract, map, of } from '@yafu/fantasy-functions'
import { RI, Ask } from './ri.js'
import { assert } from 'chai'

const ri1 = of(RI, 1) as RI<number>

const inc = (x: number) => x + 1

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getValue<T>(ri: RI<T, any>, env?: unknown): T {
  return extract(ri.run(env))
}

it('implements functor', () => {
  const result = getValue(map(inc, ri1))
  assert.equal(result, 2)
})

it('implements applicative', () => {
  const riInc = of(RI, inc)
  const result = getValue(ap(riInc, ri1))
  assert.equal(result, 2)
})

it('implements chain', () => {
  const incRI = (x: number) => of(RI, inc(x))
  const result = getValue(chain(incRI, ri1))
  assert.equal(result, 2)
})

it('exposes ask', () => {
  function incEnvWith(x: number) {
    return map((env: number) => env + x, RI.ask as Ask<number>)
  }

  const result = getValue(chain(incEnvWith, ri1), 1)
  assert.equal(result, 2)
})
