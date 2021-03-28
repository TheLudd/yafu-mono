import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import plugin from './lib/plugin'

export default {
  input: 'samplecode/index.ts',
  // external: [ '@yafu/curry' ],
  plugins: [
    resolve(),
    typescript(),
    plugin(),
  ],
  output: {
    sourcemap: true,
    dir: 'sampledist',
    format: 'es',
  },
}
