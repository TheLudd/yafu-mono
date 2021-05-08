import resolve from '@rollup/plugin-node-resolve'

export default {
  input: './index.js',
  treeshake: {
    moduleSideEffects: false,
  },
  plugins: [
    resolve(),
  ],
  output: {
    file: 'dist/lens.cjs',
    format: 'cjs',
  },
}
