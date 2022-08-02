import typescript from 'rollup-plugin-ts'
// eslint-disable-next-line
import curry from '@yafu/rollup-plugin-curry'
import replace from '@rollup/plugin-replace'

const setups = [ 'production', 'development' ]

export default [
  {
    input: './dist/ts/fantasy-functions.ts',
    plugins: [
      typescript(),
      curry(),
    ],
    output: {
      file: 'dist/ts/fantasy-functions.js',
      format: 'es',
    },
  },
  ...setups.map((environment) => ({
    input: './dist/es/fantasy-functions.js',
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      replace({ 'process.env.NODE_ENV': `'${environment}'` }),
      // resolve(),
    ],
    output: {
      file: `dist/cjs/fantasy-functions-${environment}.cjs`,
      format: 'cjs',
    },
  })),
]
