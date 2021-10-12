/* eslint-disable no-extend-native */
import { I } from 'yafu'
import {
  INIT,
  RESULT,
  STEP,
  TRANSDUCE,
} from './transformers/utils.js'
import runIteratorTransduce from './run-iterator-transduce.js'

function setTransduce (reducer, initial) {
  return runIteratorTransduce(reducer, initial, this.values())
}

function setInit () {
  return new Set(this)
}

function setStep (acc, item) {
  acc.add(item)
  return acc
}

Object.defineProperty(Set.prototype, INIT, {
  configurable: false,
  enumerable: false,
  value: setInit,
  writable: true,
})

Object.defineProperty(Set.prototype, STEP, {
  configurable: false,
  enumerable: false,
  value: setStep,
  writable: true,
})

Object.defineProperty(Set.prototype, RESULT, {
  configurable: false,
  enumerable: false,
  value: I,
  writable: true,
})

Object.defineProperty(Set.prototype, TRANSDUCE, {
  configurable: false,
  enumerable: false,
  value: setTransduce,
  writable: true,
})
