import { existsSync, mkdirSync, writeFileSync } from 'fs'
import * as fantasyLand from 'fantasy-land'

const names = Object.keys(fantasyLand)

function generate (name, path) {
  const lines = names.map((n) => (
    `export const ${n} = ${name}('${n}', definitions.${n})`
  ))

  return [
    "import { definitions } from '@yafu/fantasy-types'",
    `import ${name} from '../../lib/${path}'`,
    '',
    ...lines,
  ].join('\n')
}

function generateMain () {
  const lines = names.map((n) => (
    `export const ${n} = fantasyFunctions.${n}`
  ))

  return [
    "import * as production from './fantasy-functions-production.js'",
    "import * as debug from './fantasy-functions-development.js'",
    '',
    "const fantasyFunctions = process.env.NODE_ENV === 'production' ? production : debug",
    '',
    ...lines,
  ].join('\n')
}

if (!existsSync('dist/es')) {
  mkdirSync('dist/es', { recursive: true })
}
writeFileSync('dist/es/fantasy-functions-development.js', generate('createDebugFunction', 'create-debug-function.js'))
writeFileSync('dist/es/fantasy-functions-production.js', generate('createFunction', 'create-function.js'))
writeFileSync('dist/es/fantasy-functions.js', generateMain())
