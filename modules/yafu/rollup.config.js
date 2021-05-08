import { terser } from 'rollup-plugin-terser'

export default {
  input: 'dist/index.js',
  output: [ {
    file: 'dist/umd/yafu.cjs',
    format: 'umd',
    name: 'yafu',
    sourcemap: true,
  }, {
    file: 'dist/umd/yafu.min.cjs',
    format: 'umd',
    name: 'yafu',
    plugins: [ terser() ],
    sourcemap: true,
  } ],
}
