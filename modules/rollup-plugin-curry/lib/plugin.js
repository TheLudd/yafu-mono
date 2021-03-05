/* eslint-disable no-console */
import curryDefinition from './curry-definition.js'

export default function plugin () {
  return {
    /*
     * Any hook described in the documentation can be added as a key to this
     * object.
     * https://rollupjs.org/guide/en/#build-hooks
     * https://rollupjs.org/guide/en/#output-generation-hooks
     */
    transform (code) {
      console.log('---')
      console.log(code) // this is where we would wrap functions in curry
      return {
        code: `${code}\n // modified`,
      }
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
