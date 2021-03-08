import parse from './parse.js'
import curryPrint from './curry-print.js'

export default function cd (functionDeclaration) {
  const definition = parse(functionDeclaration)
  return curryPrint(definition)
}
