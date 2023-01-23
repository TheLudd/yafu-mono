import esbuild from 'rollup-plugin-ts'
import dts from 'rollup-plugin-dts'
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
  .map((input) => transpileFiles([ esbuild(), curry() ], input))

export default [
  ...tsTranspilations,
  transpileFiles([ curry() ], jsFiles),
  {
    input: 'dist/index.js',
    output: [ {
      file: 'dist/es/yafu.js',
      format: 'es',
      sourcemap: true,
    }, {
      file: 'dist/cjs/yafu.cjs',
      format: 'cjs',
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
  }, {
    input: 'dist/index.d.ts',
    plugins: [ dts() ],
    output: [ {
      file: 'dist/es/types.d.ts',
      format: 'es',
    }, {
      file: 'dist/cjs/types.d.cts',
      format: 'cjs',
    } ],
  },
]
