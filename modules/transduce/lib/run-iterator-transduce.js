import {
  isReduced,
  result,
  step,
  value,
} from './transformers/utils'

export default function runIteratorTransduce (reducer, initial, iterator) {
  let acc = initial
  let next
  while (!isReduced(acc) && !(next = iterator.next()).done) {
    acc = step(reducer, acc, next.value)
  }
  return isReduced(acc) ? value(acc) : result(reducer, acc)
}
