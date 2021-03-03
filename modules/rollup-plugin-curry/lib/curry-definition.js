import parse from './parse.js'
import printers from './printers.js'

export default function cd (functionDeclaration) {
  const definition = parse(functionDeclaration)
  const { parameters } = definition
  const print = printers[parameters.length - 1]
  return print(definition)
}
