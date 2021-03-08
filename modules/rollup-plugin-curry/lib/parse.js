import {
  append,
  compose,
  into,
  join,
  length,
  map,
  match,
  replace,
  split,
  trim,
} from 'ramda'

const nameRegex = /export (declare )?(function|const) (\w*)/
const genericsRegex = /<(.*?)>/
const parametersRegex = /\((.*)\)/
const openingParensRegex = /\(/g
const closingParensRegex = /\)/g

const countOpening = compose(length, match(openingParensRegex))
const countClosing = compose(length, match(closingParensRegex))

function last (arr) {
  return arr[arr.length - 1]
}

function moreOpenThanCloseParensDetected () {
  let parensCount = 0
  return (item) => {
    const nbrOpening = countOpening(item)
    const nbrClosing = countClosing(item)
    parensCount += (nbrOpening - nbrClosing)
    return parensCount > 0
  }
}

function batchWhile (pred) {
  return (transformer) => {
    const buffer = []
    return {
      '@@transducer/init': function init () {
        return transformer['@@transducer/init']
      },
      '@@transducer/step': function step (result, item) {
        if (pred(item)) {
          buffer.push(item)
          return result
        }
        const nextItem = append(item, buffer)
        buffer.splice(0)
        return transformer['@@transducer/step'](result, nextItem)
      },
      '@@transducer/result': function result (res) {
        return transformer['@@transducer/result'](res)
      },
    }
  }
}

export function paseName (string) {
  const nameMatch = string.match(nameRegex)
  return nameMatch[3]
}

export function parseGenerics (string) {
  const genericsMatch = string.match(genericsRegex)
  return genericsMatch == null
    ? []
    : genericsMatch[1].split(/, ?/).map(trim)
}

const buildPair = (s) => {
  const parts = s.split(/:/)
  const name = parts[0].trim()
  const type = parts.slice(1).join(':').trim()
  return { name, type }
}

export function parseParameters (string) {
  const parametersMatch = string.match(parametersRegex)
  const paramsString = parametersMatch[1]
  const parameters = paramsString.split(',')
  return into(
    [],
    compose(
      batchWhile(moreOpenThanCloseParensDetected()),
      map(join(',')),
      map(buildPair),
    ),
    parameters,
  )
}

const parseType = compose(trim, replace(/;\n?$/m, ''), last, split(' '))

export default function parse (string) {
  return {
    name: paseName(string),
    generics: parseGenerics(string),
    type: parseType(string),
    parameters: parseParameters(string),
  }
}
