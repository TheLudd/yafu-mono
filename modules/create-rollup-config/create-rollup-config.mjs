import { readFileSync } from 'fs'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import curry from '@yafu/rollup-plugin-curry'

export const createRollupConfig = (input, pkgURL) => {
  const pkgContent = readFileSync(new URL('./package.json', pkgURL))
  const { main: cjsFile, exports: { import: esFile } } = JSON.parse(pkgContent)
  return [ {
    input,
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      esbuild(),
      curry(),
    ],
    output: [ {
      file: esFile,
      format: 'es',
      sourcemap: true,
    }, {
      file: cjsFile,
      format: 'cjs',
      sourcemap: true,
    } ],
  }, {
    input,
    plugins: [
      dts(),
      curry({ onlyDefinitions: true }),
    ],
    output: {
      file: 'dist/types.d.ts',
      format: 'es',
    },
  } ]
}
