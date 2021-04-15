import { terser } from 'rollup-plugin-terser'

export default {
  input: 'dist/index.js',
  output: [ {
    file: 'dist/umd/yafu.js',
    format: 'umd',
    name: 'yafu',
    sourcemap: true,
  }, {
    file: 'dist/umd/yafu.min.js',
    format: 'umd',
    name: 'yafu',
    plugins: [ terser() ],
    sourcemap: true,
  } ],
}
