import { default as Glob } from 'glob'
import { parse as parseYAML } from 'yaml'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const { sync: glob } = Glob

function parsePackageJSON (path) {
  const mainPackageContent = readFileSync(path, 'utf-8')
  return JSON.parse(mainPackageContent)
}

function parseModulePackage (localPath) {
  return parsePackageJSON(resolve('../..', localPath, 'package.json'))
}

function getWorkspaces () {
  const workspaceFile = readFileSync('../../pnpm-workspace.yaml', 'utf-8')
  const { packages } = parseYAML(workspaceFile)
  return packages
}

const workspaces = getWorkspaces()

const modules = workspaces.flatMap((w) => glob(w, { cwd: '../..' }))
const getName = ({ name }) => name
const nonPrivateModuleNames = modules
  .map(parseModulePackage)
  .filter((m) => {
    const { private: isPrivate = false } = m
    return !isPrivate
  })
  .map(getName)

export default nonPrivateModuleNames
