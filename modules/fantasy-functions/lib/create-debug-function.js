import * as FL from 'fantasy-land'
import { I, composeN } from 'yafu'
import isSameType from './is-same-type.js'

function getSpecParts (spec) {
  const specParts = spec.split(':')
  return {
    main: specParts[0],
    secondary: specParts[1],
  }
}

function getExpectedString (algebra, spec) {
  const { main, secondary } = getSpecParts(spec)
  const type = algebra.constructor.name
  const messageParts = [
    'expects',
    main === '_sameType'
      ? `an instance of ${type}`
      : main === '_constructor'
        ? 'a type representative'
        : `a ${main}`,
  ]

  if (secondary != null) {
    const secondaryAction = main === '_sameType'
      ? 'containing'
      : main === '_constructor'
        ? 'with function'
        : 'returning'

    const secondaryType = secondary === '_sameType'
      ? `an instance of ${type}`
      : main === '_constructor'
        ? secondary
        : `a ${secondary}`

    messageParts.push(secondaryAction, secondaryType)
  }

  return messageParts.join(' ')
}

function isCustomSpec (s) {
  return s.startsWith('_')
}

function nilToString (v) {
  return v === undefined
    ? 'undefined'
    : v === null ? 'null' : v
}

function createValueString (isMain, algebra, specParts, value) {
  const { main } = specParts
  if (isMain) {
    if (main === '_constructor' && typeof value === 'function') return value.name
    return nilToString(value)
  }

  return main === 'function'
    ? `function returning ${nilToString(value)}`
    : `${algebra.constructor.name} containing ${nilToString(value)}`
}

function throwIfInvalid (name, algebra, spec, specPart, value) {
  if (specPart === '_any') return

  const specParts = getSpecParts(spec)
  const { main, secondary } = specParts

  // eslint-disable-next-line valid-typeof
  const isCorrectType = (!isCustomSpec(specPart) && typeof value === specPart)
    || (specPart === '_sameType' && (isSameType(value, algebra)))
    || (specPart === '_constructor' && value[secondary] != null)

  if (!isCorrectType) {
    const isMain = specPart === main
    const expected = getExpectedString(algebra, spec)
    const valueString = createValueString(isMain, algebra, specParts, value)

    throw new TypeError([
      name,
      expected,
      'but got',
      valueString,
    ].join(' '))
  }
}
export default function createDebugFunction (name, definition) {
  const {
    args,
    isStatic,
  } = definition
  const flName = FL[name]
  const fnLength = args.length + 1

  function impl (...fnArgs) {
    const algebra = isStatic ? fnArgs[0] : fnArgs[args.length]

    if (algebra[flName] == null) {
      throw new TypeError(
        `${name} expects an object with property ${flName} but got ${algebra}`,
      )
    }

    const methodArgs = isStatic ? fnArgs.slice(1) : fnArgs.slice(0, args.length)

    function wrapFn (fn, spec) {
      return (v) => {
        const result = fn(v)
        const { secondary } = getSpecParts(spec)
        throwIfInvalid(name, algebra, spec, secondary, result)
        return result
      }
    }

    function wrapAlgebra (item, spec) {
      return item[FL.map]((inner) => {
        const { secondary } = getSpecParts(spec)
        throwIfInvalid(name, algebra, spec, secondary, inner)
        return inner
      })
    }

    const wrappedArgs = methodArgs.map((item, i) => {
      const spec = args[i]
      const { main, secondary } = getSpecParts(spec)
      throwIfInvalid(name, algebra, spec, main, item)

      if (secondary == null || main === '_constructor') return item

      return main === 'function'
        ? wrapFn(item, spec)
        : wrapAlgebra(item, spec)
    })

    return algebra[flName](...wrappedArgs)
  }

  return composeN(fnLength, I, impl)
}
