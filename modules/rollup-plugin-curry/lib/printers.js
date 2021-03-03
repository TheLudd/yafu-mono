function printGenerics (generics) {
  return generics.length === 0 ? '' : `<${generics.join(', ')}>`
}

function printParameters (parameters) {
  const argString = parameters.map((item) => {
    const { name, type } = item
    return `${name}: ${type}`
  }).join(', ')
  return `(${argString})`
}

export function printUnary ({
  name,
  generics,
  parameters,
  type,
}) {
  return `
export function ${name} ${printGenerics(generics)}${printParameters(parameters)}: ${type}
`.trim()
}

export function printBinary ({
  name,
  generics,
  parameters,
  type,
}) {
  const first = parameters.slice(0, 1)
  const last = parameters.slice(1, 2)
  return `
export function ${name} ${printGenerics(generics)}${printParameters(parameters)}: ${type}
export function ${name} ${printGenerics(generics)}${printParameters(first)}: ${printParameters(last)} => ${type}
`.trim()
}

export function printTernary ({
  name,
  generics,
  parameters = [],
  type,
}) {
  const first = parameters.slice(0, 1)
  const first2 = parameters.slice(0, 2)
  const second = parameters.slice(1, 2)
  const last = parameters.slice(2, 3)
  const last2 = parameters.slice(1, 3)
  return `
export function ${name} ${printGenerics(generics)}${printParameters(parameters)}: ${type}
export function ${name} ${printGenerics(generics)}${printParameters(first2)}: ${printParameters(last)} => ${type}
export function ${name} ${printGenerics(generics)}${printParameters(first)}: {
  ${printParameters(second)} => ${printParameters(last)}: ${type}
  ${printParameters(last2)}: ${type}
}
`.trim()
}

export function printQuaternary ({
  name,
  generics,
  parameters = [],
  type,
}) {
  const first = parameters.slice(0, 1)
  const first2 = parameters.slice(0, 2)
  const first3 = parameters.slice(0, 3)
  const second = parameters.slice(1, 2)
  const third = parameters.slice(2, 3)
  const last = parameters.slice(3, 4)
  const last2 = parameters.slice(2, 4)
  const last3 = parameters.slice(1, 4)
  return `
export function ${name} ${printGenerics(generics)}${printParameters(parameters)}: ${type}
export function ${name} ${printGenerics(generics)}${printParameters(first3)}: ${printParameters(last)} => ${type}
export function ${name} ${printGenerics(generics)}${printParameters(first2)}: {
  ${printParameters(third)} => ${printParameters(last)}: ${type}
  ${printParameters(last2)}: ${type}
}
export function ${name} ${printGenerics(generics)}${printParameters(first)}: {
  ${printParameters(last3)}: ${type}
  ${printParameters(second)}: {
    ${printParameters(third)} => ${printParameters(last)}: ${type}
    ${printParameters(last2)}: ${type}
  }
  ${printParameters(second)} => ${printParameters(third)} => ${printParameters(last)}: ${type}
}
`.trim()
}

export default [
  printUnary,
  printBinary,
  printTernary,
  printQuaternary,
]
