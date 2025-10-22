import { parallelOf } from '@yafu/parallel'
import { assert } from 'chai'
import { describe, it } from 'mocha'
import { localRTF, withRTFEnv } from '../lib/rtf-functions.js'
import { RTF } from '../lib/rtf.js'

interface SpecialEnv {
  mySpecialVar: string
}
const orignalEnv = { regularVar: 42 }

const regularToSpecial = ({ regularVar }: typeof orignalEnv) => ({
  mySpecialVar: regularVar.toString(),
})

function assertEqual<Env, E, T>(
  env: Env,
  rtf: RTF<E, T, Env>,
  expected: T,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const parallel = rtf.run(env)
    parallel.fork(reject, (v) => {
      try {
        assert.equal(v, expected)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  })
}

describe('localRTF', () => {
  it('can modify the env needed for a function', () => {
    const envNeeder = new RTF(({ mySpecialVar }: SpecialEnv) =>
      parallelOf(`I found: ${mySpecialVar}`),
    )
    const asSpecial = localRTF(regularToSpecial)
    const rtf = asSpecial(envNeeder)
    return assertEqual(orignalEnv, rtf, 'I found: 42')
  })
})

describe('withRTFEnv', () => {
  it('modifies the env for a function returning an RTF', () => {
    const makeRTF = (message: string): RTF<never, string, SpecialEnv> => {
      return new RTF(({ mySpecialVar }: SpecialEnv) =>
        parallelOf(`${message} - ${mySpecialVar}`),
      )
    }
    const asSpcial = withRTFEnv(regularToSpecial)
    const makeSpecial = asSpcial(makeRTF)
    const rtf = makeSpecial('The env variable is')
    return assertEqual(orignalEnv, rtf, 'The env variable is - 42')
  })
})
