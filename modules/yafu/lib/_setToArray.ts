export function setToArray<A>(set: Set<A>): A[] {
  const array: A[] = []
  set.forEach((item) => {
    array.push(item)
  })
  return array
}
