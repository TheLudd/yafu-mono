import ts from 'rollup-plugin-ts'

export default {
  input: './index.ts',
  plugins: [
    ts(),
  ],
  output: {
    file: 'dist/fantasy-types.js',
    format: 'es',
  },
}
