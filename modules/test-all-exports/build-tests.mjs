import { camelCase } from 'camel-case'
import {
  existsSync,
  mkdirSync,
  writeFile,
} from 'fs'
import nonPrivateModuleNames from './get-non-private-module-names.mjs'

function createVariableName (name) {
  return name.endsWith('const')
    ? 'yafuConst'
    : camelCase(name.replace('@yafu/', ''))
}

function createImport (name) {
  return `import * as ${createVariableName(name)} from '${name}'`
}

function createRequire (name) {
  return `const ${createVariableName(name)} = require('${name}')`
}

if (!existsSync('dist')) {
  mkdirSync('dist')
}

const importString = nonPrivateModuleNames.map(createImport).join('\n')
const requireString = nonPrivateModuleNames.map(createRequire).join('\n')

function logError (e) {
  if (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}
writeFile('dist/imports.mjs', importString, logError)
writeFile('dist/require.cjs', requireString, logError)
