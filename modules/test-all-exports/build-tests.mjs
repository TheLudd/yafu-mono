import { default as Glob } from 'glob'
import { camelCase } from 'camel-case'
import { resolve } from 'path'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFile,
} from 'fs'

const { sync: glob } = Glob

function parsePackageJSON (path) {
  const mainPackageContent = readFileSync(path, 'utf-8')
  return JSON.parse(mainPackageContent)
}

function parseModulePackage (localPath) {
  return parsePackageJSON(resolve('../..', localPath, 'package.json'))
}

const mainPackage = parsePackageJSON('../../package.json')
const { workspaces } = mainPackage

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

const modules = workspaces.flatMap((w) => glob(w, { cwd: '../..' }))
const getName = ({ name }) => name
const nonPrivateModuleNames = modules
  .map(parseModulePackage)
  .filter((m) => {
    const { private: isPrivate = false } = m
    return !isPrivate
  })
  .map(getName)

if (!existsSync('dist')) {
  mkdirSync('dist')
}

const importString = nonPrivateModuleNames.map(createImport).join('\n')
const requireString = nonPrivateModuleNames.map(createRequire).join('\n')

function logError (e) {
  if (e) {
    console.error(e)
  }
}
writeFile('dist/imports.mjs', importString, logError)
writeFile('dist/require.cjs', requireString, logError)
