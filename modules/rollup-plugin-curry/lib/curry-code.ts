/* eslint-disable no-param-reassign */
import { parse, print } from 'recast'
import {
  ArrowFunctionExpression,
  assertExpression,
  assertIdentifier,
  callExpression,
  Declaration,
  Expression,
  FunctionDeclaration,
  identifier,
  importDeclaration,
  importSpecifier,
  isArrowFunctionExpression,
  isFunctionDeclaration,
  isVariableDeclaration,
  Program,
  stringLiteral,
  VariableDeclaration,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types'
import { traverse } from './traverse.js'

function createCurryCall (fnName: string) {
  return callExpression(identifier('curry'), [ identifier(fnName) ])
}

function curryExpression (expression: Expression) {
  return callExpression(identifier('curry'), [ expression ])
}

function createImport () {
  return importDeclaration(
    [ importSpecifier(identifier('curry'), identifier('curry')) ],
    stringLiteral('@yafu/curry'),
  )
}

function modVariableDeclaration (declaration: VariableDeclaration) {
  declaration.declarations.forEach((d) => {
    assertExpression(d.init)
    d.init = curryExpression(d.init)
  })
}

function hasArguments (declaration: FunctionDeclaration | ArrowFunctionExpression): boolean {
  return declaration.params.length > 0
}

export default function curryCode (code: string) {
  const ast = parse(code, { sourceFileName: 'dummy.js' })
  let found = false

  traverse(ast, {
    ExportNamedDeclaration (path) {
      const { node: original, node: { declaration } } = path
      const { body } = path.parent as Program
      const index = body.findIndex((n) => n === original)

      if (
        isVariableDeclaration(declaration)
        && isArrowFunctionExpression(declaration.declarations[0].init)
        && hasArguments(declaration.declarations[0].init)
      ) {
        found = true
        modVariableDeclaration(declaration)
      } else if (isFunctionDeclaration(declaration) && hasArguments(declaration)) {
        found = true
        const originalName = declaration.id?.name
        if (typeof originalName !== 'string') return
        const innerName = `_${declaration.id?.name}`
        assertIdentifier(declaration.id)
        declaration.id.name = innerName
        body.splice(index, 0, declaration)
        const curryDeclaration: Declaration = variableDeclaration('const', [
          variableDeclarator(identifier(originalName), createCurryCall(innerName)),
        ])
        path.node.declaration = curryDeclaration
      }
    },

    ExportDefaultDeclaration (path) {
      const { node: original, parent } = path
      const { body } = parent as Program

      if (isArrowFunctionExpression(original.declaration)) {
        found = true
        path.node.declaration = curryExpression(original.declaration)
      } else if (isFunctionDeclaration(original.declaration)) {
        found = true
        const index = body.findIndex((n) => n === original)
        body.splice(index, 0, original.declaration)
        const name = original.declaration.id?.name
        if (typeof name !== 'string') return
        path.node.declaration = createCurryCall(name)
      }
    },
  })

  if (found) {
    ast.program.body.unshift(createImport())
    return print(ast, { sourceMapName: 'dummy.js.map' })
  }

  return null
}
