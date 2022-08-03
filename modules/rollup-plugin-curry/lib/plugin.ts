import { PluginHooks, OutputAsset, OutputChunk } from 'rollup'
import curryDefinition from './curry-definition'
import curryCode from './curry-code'

function isOutputAsset (v: OutputAsset | OutputChunk): v is OutputAsset {
  return (v as OutputAsset).source !== undefined
}

interface CurryOpts {
  onlyDefinitions?: boolean
}

export default function plugin (opts?: CurryOpts): Partial<PluginHooks> {
  const { onlyDefinitions = false } = opts ?? {}
  return {
    transform (code, id) {
      if (id.startsWith(process.cwd())) {
        return onlyDefinitions ? curryDefinition(code) : curryCode(code)
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
