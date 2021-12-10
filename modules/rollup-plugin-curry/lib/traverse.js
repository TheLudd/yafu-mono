import babelTraverse from '@babel/traverse'

export const traverse = typeof babelTraverse === 'function' ? babelTraverse : babelTraverse.default
