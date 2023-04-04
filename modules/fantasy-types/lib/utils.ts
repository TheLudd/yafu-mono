import { FantasyDefinition } from './definitions.js'

export function needsHigherKind(spec: FantasyDefinition) {
  const { returnType, name, generics = [], extending = [] } = spec
  return (
    returnType.startsWith(name) ||
    name === 'Traversable' ||
    (generics.length > 0 && extending.length > 0)
  )
}
