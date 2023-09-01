import { readdirSync, writeFileSync } from 'fs'
import {
  basename,
  extname,
  join,
  normalize,
} from 'path'

const curryImport = "import { curry } from '@yafu/curry'"

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
  })

  const types = jsFiles.map((item) => {
    const pathName = `./${item}`
    return `export * from '${pathName}.js'`
  })

  imports.unshift(curryImport)
  types.unshift('export declare function curry (fn: Function): Function')

  writeFileSync(getAbsolute('dist/index.js'), imports.join('\n'))
  writeFileSync(getAbsolute('dist/index.d.ts'), types.join('\n'))
}

createIndex(process.cwd())
