export default {
  input: 'index.js',
  external: [ 'yafu' ],
  treeshake: {
    moduleSideEffects: false,
  },
  output: {
    file: 'dist/cjs/transduce.js',
    format: 'cjs',
  },
}
