import * as FL from 'fantasy-land'
// Disabled because lack of support for named exports in eslint The disabling
// should be removed once support is added but portential errors should be
// caught by tests anyway.
// eslint-disable-next-line import/extensions, import/no-unresolved
import { definitions } from '@yafu/fantasy-types'
import { I, composeN } from 'yafu'
import isSameType from './is-same-type.js'

const flMethodsByName = Object.entries(definitions).reduce((acc, [ fn, spec ]) => {
  const { name } = spec
  acc[name] = FL[fn]
  return acc
}, {})

function clearGeneric (string) {
  return string.replace(/<\w+>/, '')
}

function getUnaryReturnValue (spec) {
  const match = spec.match(/Unary<\w+, (.*)>/)
  return match != null ? clearGeneric(match[1]) : undefined
}

function findMethod (typeName) {
  const pairs = Object.entries(definitions)
  const match = pairs.find(([ , value ]) => value.name === typeName)
  return `fantasy-land/${match[0]}`
}

function isGeneric (paramName) {
  return /^[A-Z]$/.test(paramName)
}

function isFunction (spec) {
  return /Unary|Fold|Predicate/.test(spec)
}

function isSameTypeSpec (definition, spec) {
  const { name } = definition
  return spec.indexOf(name) === 0
}

function getFunctionReturnValue (func) {
  return func.startsWith('Predicate') ? 'boolean' : getUnaryReturnValue(func)
}

function getSpecParts (definition, spec) {
  if (isSameTypeSpec(definition, spec)) {
    const base = {
      main: definition.name,
    }
    if (isFunction(spec)) {
      Object.assign(base, { secondary: 'function' })
    }
    return base
  }
  if (isFunction(spec)) {
    return {
      main: 'function',
      secondary: getFunctionReturnValue(spec),
    }
  }
  const specParts = spec.split(':')
  return {
    main: specParts[0],
    secondary: specParts[1],
  }
}

function getExpectedString (definition, algebra, spec) {
  const { main, secondary } = getSpecParts(definition, spec)
  const type = algebra.constructor.name
  const messageParts = [
    'expects',
    isSameTypeSpec(definition, main)
      ? `an instance of ${type}`
      : main === '_constructor'
        ? 'a type representative'
        : `a ${main}`,
  ]

  if (secondary != null && !isGeneric(secondary)) {
    const secondaryAction = isSameTypeSpec(definition, main)
      ? 'containing'
      : main === '_constructor'
        ? 'of an'
        : 'returning'

    const secondaryType = isSameTypeSpec(definition, secondary)
      ? `an instance of ${type}`
      : main === '_constructor'
        ? clearGeneric(secondary)
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

function matchesType (typeName, value) {
  const method = flMethodsByName[typeName]
  return value != null && value.constructor != null && value.constructor[method] != null
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

function throwIfInvalid (definition, name, algebra, spec, specPart, value) {
  if (specPart === '_any' || isGeneric(specPart)) return

  const specParts = getSpecParts(definition, spec)
  const { main, secondary } = specParts

  // eslint-disable-next-line valid-typeof
  const isCorrectType = (!isCustomSpec(specPart) && typeof value === specPart)
    || (isSameTypeSpec(definition, specPart) && (isSameType(value, algebra)))
    || (specPart === '_constructor' && value[findMethod(clearGeneric(secondary))] != null)
    || (!isCustomSpec(specPart) && matchesType(specPart, value))

  if (!isCorrectType) {
    const isMain = specPart === main
    const expected = getExpectedString(definition, algebra, spec)
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
      return (...innerArgs) => {
        const result = fn(...innerArgs)
        const { secondary } = getSpecParts(definition, spec)
        throwIfInvalid(definition, name, algebra, spec, secondary, result)
        return result
      }
    }

    function wrapAlgebra (item, spec) {
      return item[FL.map]((inner) => {
        const { secondary } = getSpecParts(definition, spec)
        throwIfInvalid(definition, name, algebra, spec, secondary, inner)
        return inner
      })
    }

    const wrappedArgs = methodArgs.map((item, i) => {
      const spec = args[i]
      const { main, secondary } = getSpecParts(definition, spec)
      throwIfInvalid(definition, name, algebra, spec, main, item)

      if (secondary == null || main === '_constructor') return item

      return main === 'function'
        ? wrapFn(item, spec)
        : wrapAlgebra(item, spec)
    })

    return algebra[flName](...wrappedArgs)
  }

  return composeN(fnLength, I, impl)
}
