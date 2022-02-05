import typescript from 'rollup-plugin-ts'

export default function createRollupConfig (input, pkg) {
  const { main, exports: { import: esFile } } = pkg
  return {
    input,
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      typescript(),
    ],
    output: [ {
      file: esFile,
      format: 'es',
      sourcemap: true,
    }, {
      file: main,
      format: 'cjs',
      sourcemap: true,
    } ],
  }
}
