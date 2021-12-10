import {
  readFileSync,
} from 'fs'
import {
  basename,
  dirname,
  extname,
  relative,
  resolve,
} from 'path'
import {
  find,
  groupBy,
  map,
  match,
  pluck,
  prop,
  propEq,
  reduce,
  replace,
} from 'ramda'

export default function sortDependencies ({
  distFolderPath = 'dist',
  files = [],
  group = false,
}) {
  const importRegex = /import .* from '(\..*)'/g
  const distFolder = resolve(distFolderPath)

  function getImports (source) {
    const importMatches = match(importRegex, source)
    return map(replace(importRegex, '$1'), importMatches)
  }

  function rfs (path) {
    return readFileSync(path, 'utf-8')
  }

  const fileInfos = files.map((f) => {
    const content = rfs(f)
    const folder = dirname(f)
    const importBase = relative(folder, distFolder)
    return {
      distPath: resolve(dirname(f), importBase, basename(f, extname(f))),
      fullPath: resolve(f),
      imports: getImports(content),
      path: f,
    }
  })

  function scoreFile (fileInfo) {
    const { imports, score } = fileInfo
    if (score != null) return score

    return reduce((acc, item) => {
      const { fullPath } = fileInfo
      const rel = resolve(dirname(fullPath), item)
      const importDistPath = replace(new RegExp(`${extname(rel)}$`), '', rel)
      const importFileInfo = find(propEq('distPath', importDistPath), fileInfos)
      const importScore = scoreFile(importFileInfo) + 1
      return Math.max(acc, importScore)
    }, 0, imports)
  }

  fileInfos.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item.score = scoreFile(item)
  })

  function scoreComparator (a, b) {
    const { score: aScore } = a
    const { score: bScore } = b
    return aScore - bScore
  }

  fileInfos.sort(scoreComparator)

  if (group) {
    const groups = groupBy(prop('score'), fileInfos)
    return Object.values(groups)
      .map((fileInfoList) => pluck('path', fileInfoList))
  }
  return fileInfos.map(({ path }) => path)
}
