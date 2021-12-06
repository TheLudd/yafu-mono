import { curry } from '@yafu/curry'
import { extract } from '@yafu/fantasy-functions'
import { identityOf } from '@yafu/identity'
import { constOf } from '@yafu/const'

function over (lens, f, target) {
  function createOverFunctor (focus) {
    const newValue = f(focus)
    return newValue === focus ? constOf(target) : identityOf(newValue)
  }

  const functor = lens(createOverFunctor, target)
  return extract(functor)
}

export default curry(over)
