import parser from '@babel/parser'
import { CodeGenerator } from '@babel/generator'
import {
  Identifier,
  TSMethodSignature,
  exportNamedDeclaration,
  identifier,
  program,
  tsInterfaceBody,
  tsInterfaceDeclaration,
  tsMethodSignature,
  tsTypeAnnotation,
  tsTypeParameter,
  tsTypeParameterDeclaration,
  tsTypeReference,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types'
import t from '@babel/traverse'
import fs from 'fs'

const traverse = t.default

const code = fs.readFileSync('node_modules/@types/chai/index.d.ts', 'utf8')

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['typescript'],
})

const methodSignatures: TSMethodSignature[] = []

traverse(ast, {
  TSInterfaceDeclaration(path) {
    const { node } = path
    const {
      id: { name },
    } = node
    if (name === 'Assert') {
      path.traverse({
        TSMethodSignature(path) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((path.node.key as any).name !== 'fail') {
            methodSignatures.push(path.node)
          }
        },
      })
    }
  },
})

const returnType = tsTypeAnnotation(
  tsTypeReference(identifier('Promise<void>')),
)

const lcFirstChar = (str: string) => str.charAt(0).toLowerCase() + str.slice(1)

const createTSTypeParameter = (name: string) =>
  tsTypeParameter(null, null, name)

const createTypedArgument = (name: string, type: string) => {
  const id = identifier(name)
  id.typeAnnotation = tsTypeAnnotation(tsTypeReference(identifier(type)))
  return id
}

const rtfSuccessPrependTypes = [
  createTypedArgument('env', 'Env'),
  createTypedArgument('rtf', 'RTF<unknown, T, Env>'),
]

const rtfFailPrependTypes = [
  createTypedArgument('env', 'Env'),
  createTypedArgument('rtf', 'RTF<T, unknown, Env>'),
]

const parallelSuccessPrependTypes = [
  createTypedArgument('parallel', 'Parallel<unknown, T>'),
]

const parallelFailPrependTypes = [
  createTypedArgument('parallel', 'Parallel<T, unknown>'),
]

const generateInterface = (
  name: string,
  prependTypes: Identifier[],
  extraTypes: string[] = [],
) => {
  function appendToSignarture(signature: TSMethodSignature) {
    const { key, parameters, typeParameters } = signature
    const originalTypeParams = typeParameters?.params || []
    const extraTypeParameters =
      originalTypeParams.length === 0 ? ['T', ...extraTypes] : extraTypes
    const newTypeParameters = tsTypeParameterDeclaration([
      ...extraTypeParameters.map(createTSTypeParameter),
      ...originalTypeParams,
    ])
    return tsMethodSignature(
      key,
      newTypeParameters,
      [...prependTypes, ...parameters.slice(1)],
      returnType,
    )
  }

  const newAst = program([
    tsInterfaceDeclaration(
      identifier(name),
      null,
      null,
      tsInterfaceBody(methodSignatures.map(appendToSignarture)),
    ),
    exportNamedDeclaration(
      variableDeclaration('const', [
        variableDeclarator(createTypedArgument(lcFirstChar(name), name)),
      ]),
    ),
  ])

  const generator = new CodeGenerator(newAst)
  return generator.generate().code
}

const result = `
import { RTF } from '@yafu/reader-transforms'
import { Parallel } from '@yafu/parallel'

type Operator = Chai.Operator
type OperatorComparable = Chai.OperatorComparable

${generateInterface('AssertRTF', rtfSuccessPrependTypes, ['Env'])}

${generateInterface('AssertRejectedRTF', rtfFailPrependTypes, ['Env'])}

${generateInterface('AssertParallel', parallelSuccessPrependTypes)}

${generateInterface('AssertRejectedParallel', parallelFailPrependTypes)}
`.trim()

process.stdout.write(result)
