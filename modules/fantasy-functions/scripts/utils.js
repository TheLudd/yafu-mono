export function createGenerics (list) {
  return list.length ? `<${list.join(', ')}>` : ''
}
