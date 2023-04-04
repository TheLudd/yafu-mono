import {
  definitions,
  FantasyDefinition,
  needsHigherKind,
} from '@yafu/fantasy-types'

const genericsRegex = /<(.*)>/
const returnGenricsRegex = /\b[A-Z]\b/g

const argNames = 'abc'
const funcArgNames = 'fgh'

interface Param {
  name: string
  type: string
}

function* generateParameterName(names: string) {
  let i = 0
  while (true) {
    yield names[i++]
  }
}

const funcDefRexex = /Unary|Binary|Fold|Predicate/

function isFunction(def: string) {
  return funcDefRexex.test(def)
}

function formatParameterType(mainName: string, originalType: string) {
  if (originalType === '_any') return 'any'

  return originalType.replace(new RegExp(`${mainName}<(.*)>`), 'Kind<Type, $1>')
}

function generateParams(spec: FantasyDefinition): Param[] {
  const { name: mainName, args } = spec
  const argNameGenerator = generateParameterName(argNames)
  const funcArgNameGenerator = generateParameterName(funcArgNames)

  return args.map((rawType) => {
    const name =
      (isFunction(rawType)
        ? funcArgNameGenerator.next().value
        : argNameGenerator.next().value) || ''
    return { name, type: formatParameterType(mainName, rawType) }
  })
}

const getGenerics = (returnType: string): string => {
  if (returnType === 'Applicable') return 'A'
  const m = returnType.match(genericsRegex)
  return m == null ? returnType : m[1]
}

function getHKTRetunType(spec: FantasyDefinition): string {
  const { name, returnType, generics } = spec
  const nbr = generics.length === 2 ? '2' : ''
  return returnType.startsWith(name)
    ? `Kind${nbr}<Type, ${getGenerics(returnType)}>`
    : returnType
}

function createFunctionGenerics(spec: FantasyDefinition) {
  const { generics, name, returnType, args } = spec
  const typeGenerics = generics.length === 0 ? [] : [`${generics.join(', ')}`]
  if (needsHigherKind(spec)) {
    const hkt = generics.length === 2 ? 'HKT2' : 'HKT'
    typeGenerics.push(hkt)
  }
  const mainType = `Type extends ${name}<${typeGenerics.join(', ')}>`
  const returnGenerics = returnType.match(returnGenricsRegex) || []
  const argGenerics = args.filter((item) => /^[A-Z]$/.test(item))
  const allGenerics = [...generics, ...argGenerics, ...returnGenerics]
  const uniqueGenerics = allGenerics.filter(
    (item, i) => allGenerics.indexOf(item) === i,
  )
  return [...uniqueGenerics, mainType].join(', ')
}

interface EnrichedDefinition extends FantasyDefinition {
  mainType: string
  functionGenerics: string
  params: Param[]
}

function enrichDefinition(spec: FantasyDefinition): EnrichedDefinition {
  const { name, returnType: originalReturnType, generics } = spec
  const isHKT = needsHigherKind(spec)
  const returnType = isHKT ? getHKTRetunType(spec) : originalReturnType
  const needsFunctionGenerics = isHKT || generics.length > 0
  const mainType = needsFunctionGenerics ? 'Type' : name

  return {
    ...spec,
    functionGenerics: needsFunctionGenerics
      ? `<${createFunctionGenerics(spec)}> `
      : '',
    mainType,
    params: generateParams(spec),
    returnType,
  }
}

function printParam(p: Param) {
  return `${p.name}: ${p.type}`
}

const traversable = `
export function traverse <T, U, Type extends Traversable<T, HKT>, X extends HKT> (a: Applicable<X>, f: Unary<T, Kind<X, U>>, traversable: Type): Kind<X, Kind<Type, U>> {
  return traversable[TRAVERSE](a, f)
}
`
const functions = Object.entries(definitions)
  .filter((_, i) => i < 120)
  .map(([fn, spec]) => {
    const { functionGenerics, name, mainType, params, returnType, isStatic } =
      enrichDefinition(spec)
    if (name === 'Traversable') return traversable
    const ucFn = fn.toUpperCase()
    const lcName = name.toLowerCase()

    const typeParam = { name: lcName, type: mainType }
    const allParams = isStatic ? [typeParam, ...params] : [...params, typeParam]

    const paramString = allParams.map(printParam).join(', ')
    return `
export function ${fn} ${functionGenerics}(${paramString}): ${returnType} {
  return ${lcName}[${ucFn}](${params.map((p) => p.name).join(', ')})
}
`
  })

process.stdout.write('import {\n')
Object.keys(definitions).forEach((fn) => {
  process.stdout.write(`  ${fn} as ${fn.toUpperCase()},\n`)
})
process.stdout.write("} from 'fantasy-land'\n")

process.stdout.write('import {\n')
Object.values(definitions).forEach((d) => {
  const { name } = d
  process.stdout.write(`  ${name},\n`)
})
process.stdout.write("} from '@yafu/fantasy-types'\n")
process.stdout.write(
  "import { Fold, HKT, HKT2, Kind, Kind2, Predicate, Unary } from '@yafu/type-utils'\n",
)

functions.forEach((s) => {
  process.stdout.write(s)
})
