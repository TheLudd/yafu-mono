import { Readable } from 'stream'
import {
  INIT,
  RESULT,
  STEP,
  TRANSDUCE,
  isReduced,
  result,
  step,
  value,
} from '../transformers/utils.js'

function readableTransduce (reducer, initial) {
  const onEnd = () => result(reducer, initial)

  const onData = (d) => {
    const stepResult = step(reducer, initial, d)
    if (isReduced(stepResult)) {
      this.off('data', onData)
      this.off('end', onEnd)
      result(reducer, value(stepResult))
    }
  }

  this.on('data', onData)
  this.on('end', onEnd)

  return initial
}

function readableInit () {
  const r = new Readable({
    objectMode: true,
    read () {},
  })
  this.on('data', (d) => r.push(d))
  return r
}

function readableStep (readable, data) {
  readable.push(data)
  return readable
}

function readableResult (readable) {
  readable.push(null)
  return readable
}

Object.defineProperty(Readable.prototype, TRANSDUCE, {
  configurable: false,
  enumerable: false,
  value: readableTransduce,
  writable: true,
})

Object.defineProperty(Readable.prototype, INIT, {
  configurable: false,
  enumerable: false,
  value: readableInit,
  writable: true,
})

Object.defineProperty(Readable.prototype, STEP, {
  configurable: false,
  enumerable: false,
  value: readableStep,
  writable: true,
})

Object.defineProperty(Readable.prototype, RESULT, {
  configurable: false,
  enumerable: false,
  value: readableResult,
  writable: true,
})
