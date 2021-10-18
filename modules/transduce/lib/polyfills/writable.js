import { Writable } from 'stream'
import {
  INIT,
  RESULT,
  STEP,
} from '../transformers/utils.js'

function writableInit () {
  return this
}

function writableStep (pipe, data) {
  pipe.write(data)
  return pipe
}

function writableResult (pipe) {
  pipe.end()
  return pipe
}

Object.defineProperty(Writable.prototype, INIT, {
  configurable: false,
  enumerable: false,
  value: writableInit,
  writable: true,
})

Object.defineProperty(Writable.prototype, STEP, {
  configurable: false,
  enumerable: false,
  value: writableStep,
  writable: true,
})

Object.defineProperty(Writable.prototype, RESULT, {
  configurable: false,
  enumerable: false,
  value: writableResult,
  writable: true,
})
