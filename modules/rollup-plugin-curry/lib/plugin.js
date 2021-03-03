/* eslint-disable no-console */

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
      const definitionFiles = Object.keys(files).filter((s) => s.endsWith('.d.ts'))
      /*
       * These needs to be expanded. generateBundle is the only hook I have
       * found where it is possible to see which definition files have been
       * created. However, in this hook they will/have already been written to
       * disk, so we need to modify them after that. It would be better to do
       * it in a previous step but not sure if it is possible.
       */
      console.log(definitionFiles)
    },
  }
}
