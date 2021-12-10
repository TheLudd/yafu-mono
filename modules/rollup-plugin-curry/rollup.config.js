import typescript from 'rollup-plugin-ts'

export default {
  input: './lib/plugin.ts',
  plugins: [ typescript() ],
  output: [ {
    file: 'dist/es/plugin.mjs',
    format: 'es',
    exports: 'default',
    sourcemap: true,
  }, {
    file: 'dist/cjs/plugin.cjs',
    format: 'cjs',
    exports: 'default',
    sourcemap: true,
  } ],
}
