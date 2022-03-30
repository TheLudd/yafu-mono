import { assert } from 'chai'

import { parseDefinition } from '../lib/parse-definition.js'

const { deepEqual } = assert

describe('parseDefinition', () => {
	it('returns an empty list for an empty string', () => {
		const result = parseDefinition('')
		deepEqual(result, [])
	})

	it('parses parameter name and type', () => {
		const result = parseDefinition('declare function inc (i: number): number')
		deepEqual(result, [ { 
			name: 'inc',
			type: 'number',
			parameters: [ { name: 'i', type: 'number', generics: [] } ],
			line: 1,
		}])
	})

	it('parses generics', () => {
		const result = parseDefinition('declare function I <A>(a: A): A')
		deepEqual(result, [ { 
			name: 'I',
			type: 'A',
			parameters: [
				{ name: 'a', type: 'A', generics: [ 'A' ] }
			],
			line: 1,
		}])
	})

	it('parses multiple functions', () => {
		const code = `
				declare function I <A>(a: A): A
				declare function inc (i: number): number
		`
		const result = parseDefinition(code)
		deepEqual(result, [ { 
			name: 'I',
			type: 'A',
			parameters: [
				{ name: 'a', type: 'A', generics: [ 'A' ] }
			],
			line: 2,
		}, {
			name: 'inc',
			type: 'number',
			parameters: [ { name: 'i', type: 'number', generics: [] } ],
			line: 3,
		}])
	})

	it('parses generics on multiple levels', () => {
		const result = parseDefinition('declare function K <A, B>(a: A, b: B): A')
		deepEqual(result, [ { 
			name: 'K',
			type: 'A',
			parameters: [
				{ name: 'a', type: 'A', generics: [ 'A' ] },
				{ name: 'b', type: 'B', generics: [ 'B' ] },
			],
			line: 1,
		}])
	})

	it('finds generics in side other types', () => {
		const result = parseDefinition('declare function map <A, B>(f: Unary<A, B>, b: A[]): B[]')
		deepEqual(result, [ { 
			name: 'map',
			type: 'B[]',
			parameters: [
				{ name: 'f', type: 'Unary<A, B>', generics: [ 'A', 'B' ] },
				{ name: 'b', type: 'A[]', generics: [] },
			],
			line: 1,
		}])
	})

	it('handles constraints', () => {
		const result = parseDefinition('declare function of<A, Type extends Applicable<HKT>>(applicable: Type, a: A): Kind<Type, A>')
		deepEqual(result, [ { 
			name: 'of',
			type: 'Kind<Type, A>',
			parameters: [
				{ name: 'applicable', type: 'Type', generics: [ 'Type extends Applicable<HKT>' ] },
				{ name: 'a', type: 'A', generics: [ 'A' ] },
			],
			line: 1,
		}])
	})

	it('handles constraints depending on other generics used', () => {
		const result = parseDefinition('declare function chainRec<T, U, Type extends ChainRec<T, HKT>>(chainrec: Type, f: Unary<T, U>, g: Unary<U, U>, a: T): Kind<Type, U>')
		deepEqual(result, [ { 
			name: 'chainRec',
			type: 'Kind<Type, U>',
			parameters: [
				{ name: 'chainrec', type: 'Type', generics: [ 'T', 'Type extends ChainRec<T, HKT>' ] },
				{ name: 'f', type: 'Unary<T, U>', generics: [ 'U' ] },
				{ name: 'g', type: 'Unary<U, U>', generics: [] },
				{ name: 'a', type: 'T', generics: [] },
			],
			line: 1,
		}])
	})

	it('handles constraints depending on other generics used', () => {
		const result = parseDefinition('declare function promap<T, U, V, Z, Type extends Promap<T, U, HKT2>>(f: Unary<V, T>, g: Unary<U, Z>, promap: Type): Kind2<Type, V, Z>')
		deepEqual(result, [ { 
			name: 'promap',
			type: 'Kind2<Type, V, Z>',
			parameters: [
				{ name: 'f', type: 'Unary<V, T>', generics: [ 'T', 'V' ] },
				{ name: 'g', type: 'Unary<U, Z>', generics: [ 'U', 'Z' ] },
				{ name: 'promap', type: 'Type', generics: [ 'Type extends Promap<T, U, HKT2>' ] },
			],
			line: 1,
		}])
	})

	it('handles constraints used in more than one parameter', () => {
		const result = parseDefinition('declare function ap<T, U, Type extends Apply<T, HKT>>(f: Kind<Type, Unary<T, U>>, apply: Type): Kind<Type, U>')
		deepEqual(result, [ { 
			name: 'ap',
			type: 'Kind<Type, U>',
			parameters: [
				{ name: 'f', type: 'Kind<Type, Unary<T, U>>', generics: [ 'T', 'U', 'Type extends Apply<T, HKT>' ] },
				{ name: 'apply', type: 'Type', generics: [] },
			],
			line: 1,
		}])
	})
})
