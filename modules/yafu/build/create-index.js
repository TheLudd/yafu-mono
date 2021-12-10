import { readdirSync, writeFileSync } from 'fs'
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

  const jsFiles = readdirSync(getAbsolute('lib'))
    .map(getFileBaseName)
    .filter((s) => s.indexOf('_') !== 0)

  const imports = jsFiles.map((item) => {
    const pathName = `./${item}`
    return `export * from '${pathName}.js'`
  }).join('\n')

  const types = jsFiles.map((item) => {
    const pathName = `./${item}`
    return `export * from '${pathName}'`
  }).join('\n')

  writeFileSync(getAbsolute('dist/index.js'), imports)
  writeFileSync(getAbsolute('dist/index.d.ts'), types)
}

createIndex(process.cwd())
