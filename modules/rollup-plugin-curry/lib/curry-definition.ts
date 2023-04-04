import { parseDefinition } from './parse-definition.js'
import curryPrint from './curry-print.js'

export default function cd(code: string) {
  const definitions = parseDefinition(code)
  const lines = code.split('\n')
  definitions.reverse().forEach((d) => {
    const { line } = d
    const output = curryPrint(d)
    lines.splice(line - 1, 1, output)
  })
  return lines.join('\n')
}
