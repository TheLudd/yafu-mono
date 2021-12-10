import resolve from '@rollup/plugin-node-resolve'

export default {
  input: './lib/sort-dependencies.js',
  plugins: [ resolve() ],
  output: {
    exports: 'auto',
    file: './dist/cjs/sort-dependencies.cjs',
    format: 'cjs',
  }
}
