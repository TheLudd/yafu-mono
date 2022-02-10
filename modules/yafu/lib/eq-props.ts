/**
 * Check for equality with using the === binary operator of props.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function eqProps (prop: string, a: Record<string, any>, b: Record<string, any>): boolean {
  return a[prop] === b[prop]
}
