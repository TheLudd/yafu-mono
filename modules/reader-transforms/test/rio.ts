import { it } from 'mocha'
import { ap, chain, map, of } from '@yafu/fantasy-functions'
import { assert } from 'chai'
import { RIO, rioOf } from '../lib/index.js'

const rio1 = of(RIO, 1)

const inc = (x: number) => x + 1

function getValue<T, Args extends unknown[]>(
  ri: RIO<T, Args, number>,
  env = 0,
  ...args: Args
): T {
  return ri.run(env).runIO(...args)
}

it('implements functor', () => {
  const result = getValue(map(inc, rio1))
  assert.equal(result, 2)
})

it('implements applicative', () => {
  const riInc = rioOf(inc)
  const result = getValue(ap(riInc, rio1))
  assert.equal(result, 2)
})

it('implements chain', () => {
  const incRIO = (x: number) => rioOf(inc(x))
  const result = getValue(chain(incRIO, rio1))
  assert.equal(result, 2)
})

it('exposes ask', () => {
  function incEnvWith(x: number): RIO<number, [], number> {
    return map((env: number) => env + x, RIO.ask as RIO.Ask<number>)
  }

  const result = getValue(chain(incEnvWith, rio1), 1)
  assert.equal(result, 2)
})
