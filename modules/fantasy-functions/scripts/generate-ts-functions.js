import { definitions } from '@yafu/fantasy-types'
import { createGenerics } from './utils.js'

const parameterNames = 'abc'
const functionParameterNames = 'fgh'

const fnTypeRegex = /=>/
const typeRegex = /<.*>/

function* generateParameterName () {
  let i = 0
  while (true) {
    yield parameterNames[i++]
  }
}

function* generateFunctionParameterName () {
  let i = 0
  while (true) {
    yield functionParameterNames[i++]
  }
}

function modArg (d, arg) {
  const { name } = d
  return arg
    .replace(/\bT\b/, `T extends ${name}<infer V> ? V : never`)
    .replace('_sameType', name)
    .replace('_any', 'any')
}

function* generateParameterNames (d) {
  const { args } = d
  const paramGenerator = generateParameterName()
  const fnParamGenerator = generateFunctionParameterName()
  let count = 0
  while (count < args.length) {
    const item = args[count++]
    const isFunctionParam = fnTypeRegex.test(item)
    const isTypeParam = typeRegex.test(item)
    const paramName = isFunctionParam && !isTypeParam
      ? fnParamGenerator.next().value
      : paramGenerator.next().value
    yield paramName
  }
}

function generateParameters (d) {
  const { args, name, isStatic = false } = d
  const paramGenerator = generateParameterNames(d)
  const argsWithNames = args.map((item) => {
    const paramName = paramGenerator.next().value
    return `${paramName}: ${modArg(d, item)}`
  })

  if (isStatic) {
    argsWithNames.unshift(`${name.toLowerCase()}: T`)
  } else {
    argsWithNames.push(`${name.toLowerCase()}: T`)
  }

  return argsWithNames.join(', ')
}

const genericxRegexp = /\b[A-Z]\b/g

function getAny () {
  return 'any'
}

function createBody (functionName, d) {
  const { name, args } = d
  const paramGenerator = generateParameterNames(d)
  const params = args.map(() => paramGenerator.next().value).join(', ')
  return `return ${name.toLowerCase()}[${functionName.toUpperCase()}](${params})`
}

function hmm (d) {
  const { generics, name, returnType } = d
  const mainType = `T extends ${name}${createGenerics(generics.map(getAny))}`

  const returnGenerics = returnType.match(genericxRegexp) || []
  const uniqueReturnGenerics = returnGenerics.filter((g) => generics.indexOf(g) === -1)
  const allGenerics = [ mainType, ...uniqueReturnGenerics ]

  return createGenerics(allGenerics)
}

function create (functionName, d) {
  const { name, returnType } = d

  const returnGenerics = returnType.match(genericxRegexp) || []
  const actualReturnType = returnType.startsWith(name)
    ? `CallHKT<T['hkt'], ${returnGenerics.join(', ')}>`
    : returnType

  return `export function ${functionName} ${hmm(d)} (${generateParameters(d)}): ${actualReturnType} {
  ${createBody(functionName, d)}
}
  `
}

process.stdout.write('import {\n')
Object.keys(definitions).forEach((fn) => {
  process.stdout.write(`  ${fn} as ${fn.toUpperCase()},\n`)
})
process.stdout.write("} from 'fantasy-land'\n")

process.stdout.write('import {\n')
Object.values(definitions)
  .forEach((d) => {
    const { name } = d
    process.stdout.write(`  ${name},\n`)
  })
process.stdout.write('  HKT,\n')
process.stdout.write("} from '@yafu/fantasy-types'\n\n")

process.stdout.write("type CallHKT<F extends HKT, I> = (F & { input: I })['output']\n\n")

Object.entries(definitions)
  .filter(([ fn ]) => !new Set([ 'traverse', 'promap', 'bimap' ]).has(fn))
  .forEach(([ functionName, definition ]) => {
    process.stdout.write(create(functionName, definition))
    process.stdout.write('\n')
  })
