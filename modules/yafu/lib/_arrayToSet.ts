export function arrayToSet<T>(list: T[]): Set<T> {
  const set: Set<T> = new Set()
  for (let i = 0; i < list.length; i++) {
    set.add(list[i])
  }
  return set
}
