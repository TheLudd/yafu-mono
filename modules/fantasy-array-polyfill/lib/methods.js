import * as FL from 'fantasy-land'

function of (v) {
  return [ v ]
}

function map (f) {
  return this[FL.chain]((v) => of(f(v)))
}

function chain (f) {
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

function ap (b) {
  return b[FL.chain]((f) => this[FL.map](f))
}

function reduce (f, x) {
  let out = x
  for (let i = 0, len = this.length; i < len; i++) {
    out = f(out, this[i])
  }
  return out
}

function allEqual (a, b) {
  for (let i = 0, len = b.length; i < len; i++) {
    // eslint-disable-next-line no-plusplus
    if (b[i] !== a[i]) return false
  }
  return true
}

function equals (b) {
  return Array.isArray(b) && this.length === b.length && allEqual(this, b)
}

function concat (b) {
  return this.concat(b)
}

function filter (predicate) {
  const out = []
  for (let i = 0, len = this.length; i < len; i++) {
    if (predicate(this[i])) out.push(this[i])
  }
  return out
}

function appendTo (arr) {
  return (e) => arr.concat([ e ])
}

function traverse (
  a,
  f,
) {
  let out = a[FL.of]([])
  for (let i = 0, len = this.length; i < len; i++) {
    const appendToAcc = out[FL.map](appendTo)
    const toAppend = f(this[i])
    out = toAppend[FL.ap](appendToAcc)
  }
  return out
}

const methods = {
  [FL.equals]: equals,
  [FL.concat]: concat,
  [FL.filter]: filter,
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
