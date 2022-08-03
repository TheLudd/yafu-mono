import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-ts'
import plugin from './lib/plugin.ts'

export default {
  input: 'samplecode/index.ts',
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
