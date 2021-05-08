import resolve from '@rollup/plugin-node-resolve'

export default {
  input: './identity.js',
  treeshake: {
    moduleSideEffects: false,
  },
  plugins: [
    resolve(),
  ],
  output: {
    file: 'dist/identity.cjs',
    format: 'cjs',
  },
}
