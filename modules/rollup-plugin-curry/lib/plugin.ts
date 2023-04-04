import { PluginHooks, OutputAsset, OutputChunk } from 'rollup'
import curryDefinition from './curry-definition.js'
import curryCode from './curry-code.js'

function isOutputAsset(v: OutputAsset | OutputChunk): v is OutputAsset {
  return (v as OutputAsset).source !== undefined
}

function isOutputChunk(v: OutputAsset | OutputChunk): v is OutputChunk {
  return (v as OutputChunk).code !== undefined
}

interface CurryOpts {
  onlyDefinitions?: boolean
}

export default function plugin(opts?: CurryOpts): Partial<PluginHooks> {
  const { onlyDefinitions = false } = opts ?? {}
  return {
    transform(code, id) {
      if (!onlyDefinitions && id.startsWith(process.cwd())) {
        return curryCode(code)
      }
      return undefined
    },
    generateBundle(_, files) {
      Object.entries(files).forEach(([key, value]) => {
        if (!key.endsWith('.d.ts')) return
        if (isOutputChunk(value) && onlyDefinitions) {
          const { code } = value
          const newSource = curryDefinition(code)
          value.code = newSource
          return
        }
        if (!isOutputAsset(value) || typeof value.source !== 'string') return
        const { source } = value
        const newSource = curryDefinition(source)
        value.source = newSource
      })
    },
  }
}
