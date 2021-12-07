import ts from 'rollup-plugin-ts'

export default {
  input: './scripts/tsgen.ts',
  plugins: [
    ts({
      tsconfig: {
        declaration: false,
      }
    }),
  ],
  output: {
    file: 'dist/generate-ts-modules.js',
    format: 'es',
  },
}

