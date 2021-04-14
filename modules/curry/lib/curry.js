import apply from './apply.js'
import concat from './concat.js'
import slice from './slice.js'

/**
 * Curries a function according to the following rules:
 *
 * Given that `f` is a function that takes `n` arguments, if the curried `f` is called with:
 *   * **fewer than n agruments**: return a curried function that accepts the remaining arguments
 *   * **exactly n arguments**: apply the function to the arguments and return the result,
 *     if the result is a function, apply curry to it
 *   * **more than n arguments**: apply the function to the first n arguments,
 *     assume the result is a function, curry it and apply it to the remaining
 *     arguments. If the result
 *     of applying f to the first n arguments is not a function, it is considered an error.
 *
 * @function curry
 * @arg f {function} The function to curry
 *
 */
export function curry (f) {
  const { length } = f
  // eslint-disable-next-line no-use-before-define
  return length === 0 ? f : curryOfLength(length, f)
}

function isFunction (v) {
  return typeof v === 'function'
}

function curryOfLength (length, f) {
  const name = f.name || 'anonymous'
  function curried (...args) {
    const diff = length - args.length

    if (args.length === 0) return curried

    if (diff === 0) {
      const result = apply(f, args)
      return isFunction(result) ? curry(result) : result
    }

    if (diff > 0) {
      const newFn = (...innerArgs) => {
        const fullArgs = concat(args, innerArgs)
        return apply(f, fullArgs)
      }
      Object.defineProperty(newFn, 'name', { value: f.name })
      Object.defineProperty(newFn, 'toString', { value: () => f.toString() })
      return curryOfLength(diff, newFn)
    }

    const neededArgs = slice(0, length, args)
    const remainingArgs = slice(length, args.length, args)
    const result = apply(f, neededArgs)
    return apply(curry(result), remainingArgs)
  }

  Object.defineProperty(curried, 'length', { value: length })
  Object.defineProperty(curried, 'name', { value: `${name} (curried)` })
  Object.defineProperty(curried, 'toString', { value: () => f.toString() })

  return curried
}
