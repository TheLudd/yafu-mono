const typescript = require('rollup-plugin-ts')
const curry = require('@yafu/rollup-plugin-curry')

exports.createRollupConfig = (input, pkg) => {
  const { exports: { import: esFile, require: cjsFile } } = pkg
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
      file: cjsFile,
      format: 'cjs',
      sourcemap: true,
    } ],
  }
}
