import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

export default [ {
  input: './lib/plugin.ts',
  plugins: [ esbuild() ],
  output: [ {
    file: 'dist/es/plugin.js',
    format: 'es',
    exports: 'default',
    sourcemap: true,
  }, {
    file: 'dist/cjs/plugin.cjs',
    format: 'cjs',
    exports: 'default',
    sourcemap: true,
  } ],
}, {
  input: './lib/plugin.ts',
  plugins: [ dts() ],
  output: {
    file: 'dist/types.d.ts',
    format: 'es',
  },
} ]
