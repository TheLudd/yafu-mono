const { readdirSync, writeFileSync } = require('fs')
const { mkdirpSync } = require('fs-extra')
const {
  basename,
  extname,
  join,
  normalize
} = require('path')
const { camelCase } = require('camel-case')

function createIndex (projectPath) {
  function getFileBaseName (fullName) {
    const ext = extname(fullName)
    return basename(fullName, ext)
  }

  function getAbsolute (relative) {
    return normalize(join(projectPath, relative))
  }

  const jsFiles = readdirSync(getAbsolute('lib'))
    .filter((s) => basename(s).indexOf('_') !== 0 && s !== 'index.js')

  const varNames = jsFiles
    .map(getFileBaseName)
    .map((s) => s.length === 1 ? s.toUpperCase() : camelCase(s))

  const imports = jsFiles.map((item, i) => {
    const pathName = `../lib/${basename(item)}`
    const varName = varNames[i]
    return `export { default as ${varName} } from '${pathName}'`
  }).join('\n')

  mkdirpSync('dist')
  writeFileSync(getAbsolute('dist/index.js'), imports)
}

createIndex(process.cwd())
