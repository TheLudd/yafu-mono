import { compose } from 'yafu'
import { map, filter } from '../index.js'

export const inc = (x) => x + 1
export const isEven = (x) => x % 2 === 0

export const mapInc = map(inc)
export const filterEven = filter(isEven)

export const incEven = compose(filterEven, mapInc)
