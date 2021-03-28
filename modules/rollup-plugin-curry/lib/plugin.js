import curryDefinition from './curry-definition.js'
import curryCode from './curry-code.js'

export default function plugin () {
  return {
    transform (code, id) {
      if (id.startsWith(process.cwd())) {
        return curryCode(code)
      }
      return undefined
    },
    generateBundle (_, files) {
      Object.entries(files).forEach(([ key, value ]) => {
        const { source } = value
        if (key.endsWith('.d.ts') && source.includes(' function ')) {
          const sourceRows = source.split('\n')
          const newSource = sourceRows.reduce((acc, row) => (row.includes(' function ')
            ? `${acc}${curryDefinition(row)}\n`
            : `${acc}${row}\n`), '')
          // eslint-disable-next-line no-param-reassign
          value.source = newSource.slice(0, newSource.length - 1)
        }
      })
    },
  }
}
