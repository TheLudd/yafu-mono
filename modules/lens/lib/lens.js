import { curry } from '@yafu/curry'
import { flip } from 'yafu'
import { map } from '@yafu/fantasy-functions'
import { constOf } from '@yafu/const'

function lens (getter, setter, createFunctor, target) {
  const initialFocus = getter(target)
  if (initialFocus == null) return constOf(target)

  const functor = createFunctor(initialFocus)
  return map(flip(setter, target), functor)
}

export default curry(lens)
