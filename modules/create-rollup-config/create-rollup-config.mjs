import { readFileSync } from 'fs'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import curry from '@yafu/rollup-plugin-curry'

export const createRollupConfig = (input, pkgURL, {
  curry: useCurry = true,
  skipTypes = false,
} = {}) => {
  const pkgContent = readFileSync(new URL('./package.json', pkgURL))
  const { exports: { import: esFile, require: cjsFile, types: typesFile } } = JSON.parse(pkgContent)

  const mainOutputs = []

  if (esFile && !esFile.startsWith('./lib')) {
    mainOutputs.push({
      file: esFile,
      format: 'es',
      sourcemap: true,
    })
  }

  if (cjsFile && !cjsFile.startsWith('./lib')) {
    mainOutputs.push({
      file: cjsFile,
      format: 'cjs',
      sourcemap: true,
    })
  }

  const plugins = [ esbuild() ]
  if (useCurry) {
    plugins.push(curry())
  }

  const bundles = [ {
    input,
    treeshake: {
      moduleSideEffects: false,
    },
    plugins,
    output: mainOutputs,
  } ]

  if (typesFile && !skipTypes) {
    const typeFiesPlugins = [ dts() ]
    if (useCurry) {
      typeFiesPlugins.push(curry({ onlyDefinitions: true }))
    }
    bundles.push(
      {
        input,
        plugins: typeFiesPlugins,
        output: {
          file: typesFile,
          format: 'es',
        },
      },
    )
  }

  return bundles
}
