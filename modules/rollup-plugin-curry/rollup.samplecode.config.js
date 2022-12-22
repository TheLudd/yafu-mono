import resolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import plugin from './lib/plugin.ts'

export default {
  input: 'samplecode/index.ts',
  plugins: [
    resolve(),
    esbuild(),
    plugin(),
  ],
  output: {
    sourcemap: true,
    dir: 'sampledist',
    format: 'es',
  },
}
