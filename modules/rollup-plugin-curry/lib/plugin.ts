import { PluginHooks, OutputAsset, OutputChunk } from 'rollup'
import curryDefinition from './curry-definition'
import curryCode from './curry-code'

function isOutputAsset (v: OutputAsset | OutputChunk): v is OutputAsset {
  return (v as OutputAsset).source !== undefined
}

export default function plugin (): Partial<PluginHooks> {
  return {
    transform (code, id) {
      if (id.startsWith(process.cwd())) {
        return curryCode(code)
      }
      return undefined
    },
    generateBundle (_, files) {
      Object.entries(files).forEach(([ key, value ]) => {
        if (!key.endsWith('.d.ts')) return
        if (!isOutputAsset(value) || typeof value.source !== 'string') return
        const { source } = value 
        const newSource = curryDefinition(source)
        value.source = newSource
      })
    },
  }
}
