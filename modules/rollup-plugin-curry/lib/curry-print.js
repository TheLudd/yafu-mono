/* eslint-disable no-param-reassign */
import { isEmpty } from 'ramda'

function recursiveGenerateCurryStruct (parameters, type) {
  if (parameters.length === 0) {
    return type
  }
  return parameters.map((_, i) => ({
    inParams: parameters.slice(0, i + 1),
    outParams: recursiveGenerateCurryStruct(parameters.slice(i + 1), type),
  }))
}

function getSpaces (n) {
  return new Array(n + 1).join(' ')
}

function subPrintFromFunctionObj (out, functionObj, numberOfSpaces) {
  const { inParams, outParams } = functionObj
  const inString = inParams.map(({ name, type }) => `${name}: ${type}`).join(', ')
  out.outputString = `${out.outputString}${getSpaces(numberOfSpaces)}`
  out.outputString = `${out.outputString}(${inString})`
  if (Array.isArray(outParams)) {
    if (outParams.length === 1) {
      out.outputString = `${out.outputString}: `
      out.outputString = `${out.outputString}(${outParams[0].inParams[0].name}: ${outParams[0].inParams[0].type}) => ${outParams[0].outParams}\n`
    } else {
      out.outputString = `${out.outputString}: {\n`
      outParams.forEach((subObj) => {
        subPrintFromFunctionObj(out, subObj, numberOfSpaces + 2)
      })
      out.outputString = `${out.outputString}\n${getSpaces(numberOfSpaces)}}\n`
    }
  } else {
    out.outputString = `${out.outputString}: ${outParams}`
  }
}

function NamedPrintFromFunctionObj (functionName, generics, out, functionObj) {
  const { inParams, outParams } = functionObj
  const inString = inParams.map(({ name, type }) => `${name}: ${type}`).join(', ')

  if (isEmpty(generics)) {
    out.outputString = `${out.outputString}export function ${functionName} `
  } else {
    out.outputString = `${out.outputString}export function ${functionName} <${generics.join(', ')}>`
  }

  out.outputString = `${out.outputString}(${inString})`
  if (Array.isArray(outParams)) {
    if (outParams.length === 1) {
      out.outputString = `${out.outputString}: `
      out.outputString = `${out.outputString}(${outParams[0].inParams[0].name}: ${outParams[0].inParams[0].type}) => ${outParams[0].outParams}\n`
    } else {
      out.outputString = `${out.outputString}: {\n`
      outParams.forEach((subObj) => {
        subPrintFromFunctionObj(out, subObj, 2)
      })
      out.outputString = `${out.outputString}\n}\n`
    }
  } else {
    out.outputString = `${out.outputString}: ${outParams}`
  }
}

function curryPrint ({
  name,
  generics,
  parameters,
  type,
}) {
  const functionObjs = recursiveGenerateCurryStruct(parameters, type)
  const out = { outputString: '' }
  functionObjs.forEach((obj) => {
    NamedPrintFromFunctionObj(name, generics, out, obj)
  })
  return out.outputString
}

export default curryPrint
