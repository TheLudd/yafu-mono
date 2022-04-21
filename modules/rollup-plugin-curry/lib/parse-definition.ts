import { print } from 'recast'
import { parse } from '@babel/core'
import { Node, Scope } from '@babel/traverse'
import { map, uniq } from 'ramda'
import {
  Identifier,
  TSDeclareFunction,
  TSTypeAnnotation,
  TSTypeParameter,
  TSTypeParameterDeclaration,
  assertIdentifier,
  assertTSTypeAnnotation,
  isTSTypeAnnotation,
  isTSTypeParameter,
  isTSTypeParameterDeclaration,
  isTSTypeParameterInstantiation,
  isTSTypeReference,
  SourceLocation,
  isExportDeclaration,
} from '@babel/types'
import { traverse } from './traverse.js'
import { Definition, Parameter } from './types'

const options = {
  filename: 'fake.ts',
  presets: [ '@babel/preset-typescript' ],
}
const genericToString = (node: TSTypeParameter): string => {
  const { constraint, name } = node
  if (!isTSTypeReference(constraint)) return name
    const { typeParameters, typeName  } = constraint 
  // eslint-disable-next-line
  const loc = typeName.loc as any
  if (!isTSTypeParameterInstantiation(typeParameters)) return `${name} extends ${loc.identifierName}`
  // eslint-disable-next-line
  return `${name} extends ${loc.identifierName}<${typeParameters.params.map((p: any) => p.typeName.name).join(', ')}>`
}

function getFunctionName (node: TSDeclareFunction): string {
  return node.id?.name || ''
}

function getTypeName (node: TSTypeAnnotation): string {
  return print(node).code.replace(/^: /, '')
}

function getFunctionType (node: TSDeclareFunction): string {
  const { returnType } = node
  if (!isTSTypeAnnotation(returnType)) {
    return 'void'
  }

  return getTypeName(returnType)
}

function cleanType (type: string): string {
  return type.replace(/ extends.*/, '')
}

function intersectionBy (getKey: (s: string) => string, a: string[], b: string[]): string[] {
  const keySet = new Set(map(getKey, b))
  return uniq(a.filter((item) => keySet.has(getKey(item))))
}

function differenceBy (getKey: (s: string) => string, a: string[], b: string[]): string[] {
  const keySet = new Set(map(getKey, a))
  return b.filter((item) => !keySet.has(getKey(item)))
}

type GroupedGenerics = Record<string, string[]>

function analyzeParameterGenerics (groupedGenerics: GroupedGenerics, remainingFunctionGenerics: string[], genericsInParameter: string[]) {
  const thisLevelGenerics = intersectionBy(cleanType, remainingFunctionGenerics, genericsInParameter)
  const dependencies = thisLevelGenerics.flatMap((item) => groupedGenerics[item])
  const allParamGenerics = intersectionBy(cleanType, dependencies.concat(thisLevelGenerics), remainingFunctionGenerics)
  return {
    thisLevelGenerics: allParamGenerics,
    remainingGenerics: differenceBy(cleanType, allParamGenerics, remainingFunctionGenerics),
  }
}

function findTypeIdentifiers (scope: Scope) {
  return (mainNode: Node) => {
    const out: string[] = []
    function push (s: string) {
      if (out.indexOf(s) === -1) {
        out.push(s)
      }
    }
    if (isTSTypeParameter(mainNode)) push(genericToString(mainNode))

    scope.traverse(mainNode, {
      TSTypeParameter (path) {
        const { node } = path
        push(node.name)
      },
      TSTypeReference (path) {
        const { node } = path
        const { name } = node.typeName as { name: string }
        push(name)
      }
    })
    return out
  }
}

function getFunctionParameters (scope: Scope, groupedGenerics: GroupedGenerics, node: TSDeclareFunction): Parameter[] {
  let generics = Object.keys(groupedGenerics)
  return node.params.map((item) => {
    assertIdentifier(item)
    const { name, typeAnnotation } = item
    assertTSTypeAnnotation(typeAnnotation)
    const type = getTypeName(typeAnnotation)
    const foundTypes = findTypeIdentifiers(scope)(item)

    const { thisLevelGenerics, remainingGenerics } = analyzeParameterGenerics(groupedGenerics, generics, foundTypes)
    generics = remainingGenerics
    return { name, type, generics: thisLevelGenerics }
  })
}

function groupGenerics (scope: Scope, node: TSTypeParameterDeclaration) {
  const out: GroupedGenerics = {}
  const typeParameterNodes: TSTypeParameter[] = []
  const typeParameterNames = new Set<string>()
  scope.traverse(node, {
    TSTypeParameter(path) {
      const { node } = path
      const { name } = node
      typeParameterNodes.push(node)
      typeParameterNames.add(name)
    }
  })

  typeParameterNodes.forEach((tpNode) => {
    const dependencies: string[] = []
    const mainName = genericToString(tpNode)
    scope.traverse(tpNode, {
      TSTypeReference(path) {
        const { node } = path
        const { name } = node.typeName as Identifier
        if (typeParameterNames.has(name)) {
          dependencies.push(name)
        }
      }
    })
    out[mainName] = dependencies
  })
  return out
}


export function parseDefinition (code: string): Definition[] {
  const ast = parse(code, options)
  const definitions: Definition[] = []
  traverse(ast, {
    TSDeclareFunction (path) {
      const { node, scope, parent } = path
      const { typeParameters } = node

      const groupedGenerics = isTSTypeParameterDeclaration(typeParameters)
        ? groupGenerics(scope, typeParameters)
        : {}

      const definition: Definition = {
        isExported: isExportDeclaration(parent),
        name: getFunctionName(node),
        type: getFunctionType(node),
        parameters: getFunctionParameters(scope, groupedGenerics, node),
        line: (node.loc as SourceLocation).start.line,
      }
      definitions.push(definition)
    }
  })

  return definitions
}
