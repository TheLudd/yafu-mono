import { K } from 'yafu'
import { left, cata } from '@yafu/either'
import { Lens } from './lens.js'

function defaultTo <T> (d: T) {
  return (v: T) => (v == null ? d : v)
}

export function view <F, T> (defaultVal: F, lens: Lens<F, T>, value: T): F {
  const either = lens(left, value)
  return cata(defaultTo(defaultVal), K(defaultVal), either)
}
