import resolve from '@rollup/plugin-node-resolve'

export default {
  input: './const.js',
  treeshake: {
    moduleSideEffects: false,
  },
  plugins: [
    resolve(),
  ],
  output: {
    file: 'dist/const.cjs',
    format: 'cjs',
  },
}
