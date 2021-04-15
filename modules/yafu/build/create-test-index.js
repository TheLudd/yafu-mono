import { readdirSync, writeFileSync } from 'fs'
import {
  basename,
  extname,
  join,
  normalize,
} from 'path'
import { camelCase } from 'camel-case'

function createIndex (projectPath) {
  function getFileBaseName (fullName) {
    const ext = extname(fullName)
    return basename(fullName, ext)
  }

  function getAbsolute (relative) {
    return normalize(join(projectPath, relative))
  }

  const jsFiles = readdirSync(getAbsolute('test'))
    .filter((s) => basename(s).indexOf('_') !== 0 && s !== 'index.js')

  const varNames = jsFiles
    .map(getFileBaseName)
    .map((s) => (s.length === 1 ? s.toUpperCase() : camelCase(s)))

  const imports = jsFiles.map((item, i) => {
    const pathName = `./${basename(item)}`
    const varName = varNames[i]
    return `export { default as ${varName} } from '${pathName}'`
  }).join('\n')

  writeFileSync(getAbsolute('test/index.js'), imports)
}

createIndex(process.cwd())
