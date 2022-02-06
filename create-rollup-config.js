import typescript from 'rollup-plugin-ts'
import curry from '@yafu/rollup-plugin-curry'

export default function createRollupConfig (input, pkg) {
  const { main, exports: { import: esFile } } = pkg
  return {
    input,
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      typescript(),
      curry(),
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
