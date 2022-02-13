import { K, I } from 'yafu'
import { Either, right, cata, left } from '@yafu/either'
import { Lens } from './lens'

export function over <F, T, U extends F>(lens: Lens<F, T>, f: (a: F) => U, target: T): T {
  function createEither (focus: F): Either<F, F> {
    const newValue = f(focus)
    return (newValue === focus ? left(focus) : right(newValue))
  }

  const either = lens(createEither, target)
  return cata(K(target), I, either)
}
