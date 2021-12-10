import { readdirSync, writeFileSync } from 'fs'
import { camelCase } from 'camel-case'
import {
  basename,
  extname,
  join,
  normalize,
} from 'path'

function createIndex (projectPath) {
  function getFileBaseName (fullName) {
    const ext = extname(fullName)
    return basename(fullName, ext)
  }

  function getAbsolute (relative) {
    return normalize(join(projectPath, relative))
  }

  const jsFiles = readdirSync(getAbsolute('test'))
    .filter((s) => s.indexOf('_') !== 0 && !s.endsWith('index.js'))
    .map(getFileBaseName)

  const imports = jsFiles.map((item) => {
    const pathName = `./${item}`
    const varName = item.length === 1 ? item.toUpperCase() : camelCase(item)
    return `export { default as ${varName} } from '${pathName}.js'`
  }).join('\n')

  writeFileSync(getAbsolute('test/index.js'), imports)
}

createIndex(process.cwd())
