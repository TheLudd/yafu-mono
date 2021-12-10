/**
 * Check for equality with using the === binary operator of props.
 */
export function eqProps (prop: string, a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  return a[prop] === b[prop]
}
