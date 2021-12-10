/* eslint-disable no-param-reassign */
import {
  isEmpty,
  propOr,
  compose,
  join,
  map,
  chain,
} from 'ramda'
import { Definition, Parameter } from './types'

interface CurryStruct {
  inParams: Parameter[],
  outParams: string | CurryStruct[],
}

function recursiveGenerateCurryStruct (parameters: Parameter[], type: string): CurryStruct[] | string {
  if (parameters.length === 0) {
    return type
  }
  return parameters.map((_, i) => ({
    inParams: parameters.slice(0, i + 1),
    outParams: recursiveGenerateCurryStruct(parameters.slice(i + 1), type),
  }))
}

function getSpaces (n: number) {
  return new Array(n + 1).join(' ')
}

function printParameter ({ name, type }: Parameter) {
  return `${name}: ${type}`
}

const printParameters = compose(join(', '), map(printParameter))
const printGenerics = (list: string[]) => (isEmpty(list) ? '' : `<${join(', ', list)}>`)

const findParamsGenerics: (s: Parameter[]) => string[] = chain(propOr([], 'generics'))

function subPrintFromFunctionObj (out: StringBuilder, functionObj: CurryStruct, numberOfSpaces: number) {
  const { inParams, outParams } = functionObj
  const generics = findParamsGenerics(inParams)

  out.outputString = `${out.outputString}${getSpaces(numberOfSpaces)}${printGenerics(generics)}`
  out.outputString = `${out.outputString}(${printParameters(inParams)})`

  if (Array.isArray(outParams)) {
    if (outParams.length === 1) {
      const lastParam = outParams[0].inParams[0]
      const { generics: lastGenerics = [] } = lastParam
      out.outputString = `${out.outputString}: ${printGenerics(lastGenerics)}`
      out.outputString = `${out.outputString}(${printParameter(lastParam)}) => ${outParams[0].outParams}\n`
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

interface StringBuilder {
  outputString: string
}

function NamedPrintFromFunctionObj (functionName: string, out: StringBuilder, functionObj: CurryStruct) {
  const { inParams, outParams } = functionObj
  const generics = findParamsGenerics(inParams)

  out.outputString = `${out.outputString}export declare function ${functionName} ${printGenerics(generics)}`
  out.outputString = `${out.outputString}(${printParameters(inParams)})`

  if (Array.isArray(outParams)) {
    if (outParams.length === 1) {
      const lastParam = outParams[0].inParams[0]
      const { generics: lastGenerics = [] } = lastParam
      out.outputString = `${out.outputString}: ${printGenerics(lastGenerics)}`
      out.outputString = `${out.outputString}(${printParameter(lastParam)}) => ${outParams[0].outParams}\n`
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

type CurryPrintInput = Omit<Definition, 'line'>

export default function curryPrint ({
  name,
  parameters,
  type,
}: CurryPrintInput) {
  const functionObjs = recursiveGenerateCurryStruct(parameters, type) as CurryStruct[]
  const out = { outputString: '' }
  functionObjs.forEach((obj) => {
    NamedPrintFromFunctionObj(name, out, obj)
  })
  return out.outputString
}
