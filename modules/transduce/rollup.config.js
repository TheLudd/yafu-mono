import { basename, extname } from 'path'
import { sync as glob } from 'glob'

const polyfills = glob('./lib/polyfills/*')

export default [ {
  input: 'index.js',
  external: [ 'yafu' ],
  treeshake: {
    moduleSideEffects: false,
  },
  output: {
    file: 'dist/cjs/transduce.cjs',
    format: 'cjs',
  },
}, ...polyfills.map((file) => ({
  input: file,
  external: [ 'yafu' ],
  treeshake: {
    moduleSideEffects: false,
  },
  output: {
    file: `dist/cjs/polyfills/${basename(file, extname(file))}.cjs`,
    format: 'cjs',
  },
})) ]
