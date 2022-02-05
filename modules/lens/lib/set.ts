import { K } from 'yafu'
import { over } from './over'
import { Lens } from './lens'

export function set <F, T>(lens: Lens<F, T>, value: F, target: T): T {
  return over(lens, K(value), target)
}
