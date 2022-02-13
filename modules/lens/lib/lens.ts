import { flip } from 'yafu'
import { map } from '@yafu/fantasy-functions'
import { Either, left } from '@yafu/either'

export type Lens<F, T> = (createEither: (focus: F) => Either<F, F>, target: T) => Either<F, T>

export function lens <F, T> (
  getter: (target: T) => F,
  setter: (focus: F, target: T) => T,
): Lens<F, T> {
  return (createEither: (focus: F) => Either<F, F>, target: T): Either<F, T> => {
    const initialFocus = getter(target)
    if (initialFocus == null) return left(initialFocus)

    const either = createEither(initialFocus)
    const setOnTarget = flip(setter, target)
    return map(setOnTarget, either)
  }
}
