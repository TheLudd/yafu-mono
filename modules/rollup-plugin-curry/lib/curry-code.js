/* eslint-disable no-param-reassign */
import { parse, print } from 'recast'
import babelTraverse from '@babel/traverse'
import {
  callExpression,
  identifier,
  importDeclaration,
  importSpecifier,
  isArrowFunctionExpression,
  isFunctionDeclaration,
  isVariableDeclaration,
  stringLiteral,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types'

// This was the only way for the import to work in both tanspiled
// and non transpiled environments.
const traverse = typeof babelTraverse === 'function' ? babelTraverse : babelTraverse.default

function createCurryCall (fnName) {
  return callExpression(identifier('curry'), [ identifier(fnName) ])
}

function curryExpression (expression) {
  return callExpression(identifier('curry'), [ expression ])
}

function createImport () {
  return importDeclaration(
    [ importSpecifier(identifier('curry'), identifier('curry')) ],
    stringLiteral('@yafu/curry'),
  )
}

function modVariableDeclaration (declaration) {
  declaration.declarations.forEach((d) => {
    d.init = curryExpression(d.init)
  })
}

export default function curryCode (code) {
  const ast = parse(code, { sourceFileName: 'dummy.js' })
  let found = false

  traverse(ast, {
    ExportNamedDeclaration (path) {
      const { node: original, parent: { body }, node: { declaration } } = path
      const index = body.findIndex((n) => n === original)

      if (
        isVariableDeclaration(declaration)
        && isArrowFunctionExpression(declaration.declarations[0].init)
      ) {
        found = true
        modVariableDeclaration(declaration)
      } else if (isFunctionDeclaration(declaration)) {
        found = true
        const originalName = declaration.id.name
        const innerName = `_${declaration.id.name}`
        path.node.declaration.id.name = innerName
        body.splice(index, 0, original.declaration)
        path.node.declaration = variableDeclaration('const', [
          variableDeclarator(identifier(originalName), createCurryCall(innerName)),
        ])
      }
    },

    ExportDefaultDeclaration (path) {
      const { node: original, parent: { body } } = path

      if (isArrowFunctionExpression(original.declaration)) {
        found = true
        path.node.declaration = curryExpression(original.declaration)
      } else if (isFunctionDeclaration(original.declaration)) {
        found = true
        const index = body.findIndex((n) => n === original)
        body.splice(index, 0, original.declaration)
        path.node.declaration = createCurryCall(path.node.declaration.id.name)
      }
    },
  })

  if (found) {
    ast.program.body.unshift(createImport())
    return print(ast, { sourceMapName: 'dummy.js.map' })
  }

  return null
}
