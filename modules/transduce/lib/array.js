/* eslint-disable no-extend-native */
import { I } from 'yafu'
import {
  INIT,
  RESULT,
  STEP,
  TRANSDUCE,
} from './transformers/utils'
import runIteratorTransduce from './run-iterator-transduce'

function arrayTransduce (reducer, initial) {
  return runIteratorTransduce(reducer, initial, this.values())
}

function arrayInit () {
  return this.concat([])
}

function arrayStep (acc, item) {
  acc.push(item)
  return acc
}

Object.defineProperty(Array.prototype, TRANSDUCE, {
  configurable: false,
  enumerable: false,
  value: arrayTransduce,
  writable: true,
})

Object.defineProperty(Array.prototype, INIT, {
  configurable: false,
  enumerable: false,
  value: arrayInit,
  writable: true,
})

Object.defineProperty(Array.prototype, STEP, {
  configurable: false,
  enumerable: false,
  value: arrayStep,
  writable: true,
})

Object.defineProperty(Array.prototype, RESULT, {
  configurable: false,
  enumerable: false,
  value: I,
  writable: true,
})
