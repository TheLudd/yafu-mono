import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import curry from '@yafu/rollup-plugin-curry'
import replace from '@rollup/plugin-replace'

const setups = [ 'production', 'development' ]

const prefixExport = (s) => s.replace(/^declare/mg, 'export declare')
const removeMainExport = (s) => s.replace(/^export.*/mg, '')

function isOutputChunk (v) {
  return v.code !== undefined
}

export default [
  {
    input: './dist/ts/fantasy-functions.ts',
    plugins: [
      esbuild(),
      curry(),
    ],
    output: {
      file: 'dist/ts/fantasy-functions.js',
      format: 'es',
    },
  },
  {
    input: './dist/ts/fantasy-functions.ts',
    plugins: [
      dts(),
      {
        generateBundle (_, files) {
          Object.values(files).forEach((value) => {
            if (isOutputChunk(value)) {
              const { code } = value
              const newSource = prefixExport(removeMainExport(code)).trim()
              // eslint-disable-next-line no-param-reassign
              value.code = newSource
            }
          })
        },
      },
      curry({ onlyDefinitions: true }),
    ],
    output: {
      file: 'dist/ts/fantasy-functions.d.ts',
      format: 'es',
    },
  },
  ...setups.map((environment) => ({
    input: './dist/es/fantasy-functions.js',
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      replace({
        preventAssignment: true,
        values: { 'process.env.NODE_ENV': `'${environment}'` },
      }),
      // resolve(),
    ],
    output: {
      file: `dist/cjs/fantasy-functions-${environment}.cjs`,
      format: 'cjs',
    },
  })),
]
