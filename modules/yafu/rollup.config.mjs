import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-ts'
import globPkg from 'glob'
import { terser } from 'rollup-plugin-terser'
import curry from '@yafu/rollup-plugin-curry'
import sortDependencies from 'sort-dependencies'

const { sync: glob } = globPkg
const tsFiles = glob('lib/*.ts')
const jsFiles = glob('lib/*.js')
const tsFileGroups = sortDependencies({
  distFolderPath: 'dist',
  files: tsFiles,
  group: true,
})

function transpileFiles (plugins, input) {
  return {
    input,
    external: () => true,
    plugins,
    output: {
      dir: 'dist',
      format: 'es',
      sourcemap: true,
    },
  }
}

const tsTranspilations = tsFileGroups
  .map((input) => transpileFiles([ typescript(), curry() ], input))

export default [
  ...tsTranspilations,
  transpileFiles([ curry() ], jsFiles),
  {
    input: 'dist/index.js',
    plugins: [ resolve() ],
    output: [ {
      file: 'dist/cjs/yafu.cjs',
      format: 'cjs',
      name: 'yafu',
      sourcemap: true,
    }, {
      file: 'dist/umd/yafu.js',
      format: 'umd',
      name: 'yafu',
      sourcemap: true,
    }, {
      file: 'dist/umd/yafu.min.js',
      format: 'umd',
      name: 'yafu',
      plugins: [ terser() ],
      sourcemap: true,
    } ],
  },
]
