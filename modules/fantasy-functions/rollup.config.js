import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import curry from '@yafu/rollup-plugin-curry'
import replace from '@rollup/plugin-replace'

const setups = [ 'production', 'development' ]

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
