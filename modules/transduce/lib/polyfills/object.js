/* eslint-disable no-extend-native */
import { I } from 'yafu'
import {
  INIT,
  RESULT,
  STEP,
} from '../transformers/utils.js'

function objectInit () {
  return { ...this }
}

function objectStep (acc, item) {
  return Object.assign(acc, item)
}

Object.defineProperty(Object.prototype, INIT, {
  configurable: false,
  enumerable: false,
  value: objectInit,
  writable: true,
})

Object.defineProperty(Object.prototype, STEP, {
  configurable: false,
  enumerable: false,
  value: objectStep,
  writable: true,
})

Object.defineProperty(Object.prototype, RESULT, {
  configurable: false,
  enumerable: false,
  value: I,
  writable: true,
})
