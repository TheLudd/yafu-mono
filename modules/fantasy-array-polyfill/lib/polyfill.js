import { methods, statics } from './methods.js'

function propIsNil (obj, key) {
  return obj[key] == null
}

function polyfill () {
  Object.entries(methods).forEach(([ key, value ]) => {
    if (propIsNil(Array.prototype, key)) {
      // eslint-disable-next-line no-extend-native
      Object.defineProperty(Array.prototype, key, {
        configurable: false,
        enumerable: false,
        value,
        writable: true,
      })
    }
  })

  Object.assign(Array, statics)
}

export default polyfill
