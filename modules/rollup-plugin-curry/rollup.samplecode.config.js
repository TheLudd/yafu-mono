import typescript from 'rollup-plugin-typescript2'
import plugin from './lib/plugin'

export default {
  input: 'samplecode/index.ts',
  plugins: [
    typescript(),
    plugin(),
  ],
  output: {
    dir: 'sampledist',
    format: 'es',
  },
}
