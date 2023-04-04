import * as FL from 'fantasy-land'
import { definitions, FantasyDefinition } from '../lib/definitions'

const parameterNames = ['a', 'b', 'c']
const innerParameterNames = ['x', 'y', 'z']

function createGenerics(list: string[]) {
  return list.length ? `<${list.join(', ')}>` : ''
}

function getReturnType(spec: FantasyDefinition) {
  const { args, generics, name, returnType } = spec
  if (!returnType.startsWith(name)) return returnType

  if (generics.length === 0) return `Kind<Type, ${args.join('')}>`

  return generics.length === 1
    ? returnType.replace(/\w+<(.*)>/, 'Kind<Type, $1>')
    : returnType.replace(/\w+<(.*)>/, 'Kind2<Type, $1>')
}

const initial: Record<string, FantasyDefinition> = {}
const defsByName = Object.values(definitions).reduce((acc, item) => {
  const { name } = item
  acc[name] = item
  return acc
}, initial)

function notTraversable([fn]: any[]) {
  return fn !== 'traverse'
}

const allDefs = Object.entries(definitions)
  .filter(notTraversable)
  .map(([fn, spec]) => {
    const {
      args,
      extending = [],
      generics: genericsList = [],
      extendingGenerics: extendingGenericsList = genericsList.concat([]),
      isStatic = false,
      returnType: originalReturnType,
      name,
    } = spec

    const returnType = getReturnType(spec)

    function createInnerArg(parameter: string, i: number) {
      // eslint-disable-next-line no-use-before-define
      return `${innerParameterNames[i]}: ${getParameterType(parameter)}`
    }

    function createFunctionType(arg: string): string {
      const parts = arg.split(':')
      const fnReturnType = parts[parts.length - 1]
      const fnArgs = parts.slice(1, -1)
      const fnParameters = fnArgs.map(createInnerArg)
      return `(${fnParameters.join(', ')}) => ${fnReturnType}`
    }

    function getParameterType(arg: string) {
      if (arg.indexOf(name) !== -1)
        return arg.replace(new RegExp(`${name}<\(\.*\)>`), 'Kind<Type, $1>')
      if (arg === '_any') return 'any'
      if (arg === '_contained') return 'T'
      if (arg.indexOf('_constructor') !== -1)
        return arg.replace('_constructor:', '')
      if (arg.startsWith('function')) return createFunctionType(arg)

      return arg
    }

    function formatArgument(arg: string, i: number) {
      const type = getParameterType(arg)
      const paramName = parameterNames[i]

      return `${paramName}: ${type}`
    }

    const needsHigherKind =
      originalReturnType.startsWith(name) ||
      name === 'Traversable' ||
      (genericsList.length > 0 && extending.length > 0)

    if (isStatic) {
      extending.splice(0)
    }

    if (needsHigherKind) {
      extendingGenericsList.push('Type')
      if (genericsList.length === 2) {
        genericsList.push('Type extends HKT2')
        extending.unshift('HKT2')
      } else {
        genericsList.push('Type extends HKT')
        extending.unshift('HKT')
      }
    }

    const extendingGenerics = createGenerics(extendingGenericsList)
    const extendWithGenerics = extending
      .filter((item) => defsByName[item]?.isStatic !== true)
      .map((item) => {
        if (/HKT/.test(item)) return item
        const gen =
          item === 'Foldable'
            ? createGenerics(extendingGenericsList.slice(0, -1))
            : extendingGenerics
        return `${item}${gen}`
      })

    const generics = createGenerics(genericsList)
    const allGenerics = Array.from(
      new Set(`${args.join()} ${returnType}`.match(/\b[A-Z]\b/g)),
    )
    const methodGenericsList = allGenerics.filter(
      (x) => generics.indexOf(x) === -1,
    )
    const methodGenerics = methodGenericsList.length
      ? `<${methodGenericsList.join(', ')}>`
      : ''

    const method = `['${FL[fn]}']: ${methodGenerics}(${args
      .map(formatArgument)
      .join(', ')})`
    const extendStatement = extending.length
      ? ` extends ${extendWithGenerics.join(', ')}`
      : ''
    const lines = [
      isStatic ? '// static' : '',
      `export interface ${name}${generics}${extendStatement} {`,
      `  ${method} => ${returnType}`,
      '}',
    ]

    return lines.join('\n').trim()
  })

process.stdout.write(
  "import { Fold, HKT, HKT2, Kind, Kind2, Predicate, Unary } from '@yafu/type-utils'\n\n",
)
process.stdout.write(allDefs.join('\n\n'))
process.stdout.write(`\n
export interface Traversable<T, Type extends HKT> extends HKT, Functor<T, Type>, Foldable<T> {
  ['${FL.traverse}']: <U, X extends HKT>(a: Applicable<X>, b: Unary<T, Kind<X, U>>) => Kind<X, Kind<Type, U>>
}
`)
