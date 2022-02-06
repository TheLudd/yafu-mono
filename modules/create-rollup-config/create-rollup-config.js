const typescript = require('rollup-plugin-ts')
const curry = require('@yafu/rollup-plugin-curry')

exports.createRollupConfig = (input, pkg) => {
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
