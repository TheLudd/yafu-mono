import resolve from '@rollup/plugin-node-resolve'
import replace from 'rollup-plugin-replace'

const setups = [ 'production', 'development' ]

export default setups.map((environment) => ({
  input: './dist/es6/fantasy-functions.js',
  treeshake: {
    moduleSideEffects: false,
  },
  plugins: [
    replace({ 'process.env.NODE_ENV': `'${environment}'` }),
    resolve(),
  ],
  output: {
    file: `dist/cjs/fantasy-functions-${environment}.cjs`,
    format: 'cjs',
  },
}))
