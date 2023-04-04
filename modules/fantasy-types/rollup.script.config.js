import esbuild from 'rollup-plugin-esbuild'

export default {
  input: './scripts/tsgen.ts',
  plugins: [ esbuild() ],
  output: {
    file: 'dist/generate-ts-modules.js',
    format: 'es',
  },
}
