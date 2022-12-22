import esbuild from 'rollup-plugin-esbuild'

export default {
  input: './lib/plugin.ts',
  plugins: [ esbuild() ],
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
