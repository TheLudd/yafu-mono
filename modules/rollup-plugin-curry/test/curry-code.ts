import { assert } from 'chai'
import { PrintResultType } from 'recast/lib/printer.js'
import curryCode from '../lib/curry-code.js'

const { equal, isNull } = assert

describe('curryCode', () => {
  it('ignores non function default exports', () => {
    const original = 'export default foo(bar)'
    const result = curryCode(original)
    isNull(result)
  })

  it('ignores non function named exports', () => {
    const original = 'export const bar = 2'
    const result = curryCode(original)
    isNull(result)
  })

  describe('ignores nullary functions', () => {
    it('for arrow functions', () => {
      const original = `
export const impure = () => null
`
      const result = curryCode(original)
      isNull(result)
    })

    it('for named functions', () => {
      const original = `
export function impure() {
}
`
      const result = curryCode(original)
      isNull(result)
    })

    it('for default export named functions', () => {
      const original = `
export default function impure() {
}
`
      const result = curryCode(original)
      isNull(result)
    })

    it('for default export arrow functions', () => {
      const original = `
export default () => null
`
      const result = curryCode(original)
      isNull(result)
    })
  })

  describe('ignores functions that return instantiations', () => {
    it('for arrow functions', () => {
      const original = `
export const instantiateArrowStyle = (somevar) => {
  return new SomeClass(somevar)
}
`
      const result = curryCode(original)
      isNull(result)
    })

    it('for inline arrow functions', () => {
      const original = `
export const instantiateArrowStyle = (somevar) => new SomeClass(somevar)
`
      const result = curryCode(original)
      isNull(result)
    })

    it('for named functions', () => {
      const original = `
export function instantiateNamedStyle(somevar) {
  return new SomeClass(somevar)
}
`
      const result = curryCode(original)
      isNull(result)
    })

    it('for default export named functions', () => {
      const original = `
export default function instantiateNamedStyle(somevar) {
  return new SomeClass(somevar)
}
`
      const result = curryCode(original)
      isNull(result)
    })

    it('for default export arrow functions', () => {
      const original = `
export default (somevar) => {
  return new SomeClass(somevar)
}
`
      const result = curryCode(original)
      isNull(result)
    })
  })

  it('curries default function exports', () => {
    const original = 'export default function identity (a) { return a }'
    const { code } = curryCode(original) as PrintResultType
    const expected = `
import { curry } from "@yafu/curry";
function identity(a) { return a }
export default curry(identity);
    `.trim()
    equal(code, expected)
  })

  it('curries default arrow function exports', () => {
    const original = 'export default (a) => a'
    const { code } = curryCode(original) as PrintResultType
    const expected = `
import { curry } from "@yafu/curry";
export default curry(a => a);
    `.trim()
    equal(code, expected)
  })

  it('curries named function exports', () => {
    const original = 'export function identity (a) { return a }'
    const { code } = curryCode(original) as PrintResultType
    const expected = `
import { curry } from "@yafu/curry";
function _identity(a) { return a }
export const identity = curry(_identity);
    `.trim()
    equal(code, expected)
  })

  it('curries named arrow function exports', () => {
    const original = 'export const identity = (a) => a'
    const { code } = curryCode(original) as PrintResultType
    const expected = `
import { curry } from "@yafu/curry";
export const identity = curry((a) => a)
    `.trim()
    equal(code, expected)
  })
})
