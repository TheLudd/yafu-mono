import { Applicable, Apply } from '@yafu/fantasy-types'
import { Fold, Unary, Kind, HKT } from '@yafu/type-utils'
import * as FL from 'fantasy-land'

function of <T> (v: T): T[] {
  return [ v ]
}

function map <T, U>(this: T[], f: Unary<T, U>): U[] {
  return this[FL.chain]((v) => of(f(v)))
}

function chain <T, U> (this: T[], f: Unary<T, U[]>): U[] {
  const out = []
  for (let i = 0, len = this.length; i < len; i++) {
    const v = this[i]
    const array = f(v)
    for (let j = 0, innerLen = array.length; j < innerLen; j++) {
      out.push(array[j])
    }
  }
  return out
}

function ap <T, U> (this: T[], b: Unary<T, U>[]): U[] {
  return b[FL.chain]((f) => this[FL.map](f))
}

function reduce <T, U> (this: T[], f: Fold<T, U>, x: U): U {
  let out = x
  for (let i = 0, len = this.length; i < len; i++) {
    out = f(out, this[i])
  }
  return out
}

function allEqual (a: unknown[], b: unknown[]) {
  for (let i = 0, len = b.length; i < len; i++) {
    // eslint-disable-next-line no-plusplus
    if (b[i] !== a[i]) return false
  }
  return true
}

function equals <T> (this: T[], b: unknown) {
  return Array.isArray(b) && this.length === b.length && allEqual(this, b)
}

function concat <T>(this: T[], b: T[]): T[] {
  return this.concat(b)
}

function appendTo <T> (arr: T[]) {
  return (e: T) => arr.concat([ e ])
}

function traverse <T, U, X extends HKT> (this: T[], a: Applicable<X>, f: Unary<T, Kind<X, U>>): Kind<X, U[]> {
  let out = a[FL.of]([] as U[]) as Apply<U[], X>
  for (let i = 0, len = this.length; i < len; i++) {
    const appendToAcc = out[FL.map](appendTo)
    const toAppend = f(this[i]) as Apply<U, X>
    out = toAppend[FL.ap](appendToAcc) as Apply<U[], X>
  }
  return out
}

const methods = {
  [FL.equals]: equals,
  [FL.concat]: concat,
  [FL.map]: map,
  [FL.ap]: ap,
  [FL.chain]: chain,
  [FL.reduce]: reduce,
  [FL.traverse]: traverse,
}

const statics = {
  [FL.of]: of,
  [FL.empty]: () => [],
}

export { methods, statics }
