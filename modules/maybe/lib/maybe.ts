import {
	ap as AP,
	of as OF,
	chain as CHAIN,
	equals as EQUALS,
	map as MAP,
	reduce as REDUCE,
} from 'fantasy-land'
import '@yafu/fantasy-functions'
import { map } from '@yafu/fantasy-functions'

declare module '@yafu/fantasy-functions' {
	export function ap<T, U>(a: Maybe<(x: T) => U>, apply: Maybe<T>): Maybe<U>
	export function chain <T, U> (f: (a: T) => Maybe<U>, m: Maybe<T>): Maybe<U>
	export function map <T, U> (f: (a: T) => U, m: Maybe<T>): Maybe<U>
	export function reduce <T, U> (f: (acc: U, item: T) => U, seed: U, m: Maybe<T>): U
}

export type Maybe<T> = Just<T> | Nothing

abstract class M {
	static [OF] = maybeOf
}

type Binary<A, B, C> = (a: A, b: B) => C
type Unary<A, B> = (a: A) => B
type Fold<A, B> = Binary<B, A, B>

class Just<T> extends M {

	v: T

	constructor (v: T) {
		super()
		this.v = v
	}

	[MAP] <U> (f: Unary<T, U>): Just<U> {
		return new Just(f(this.v))
	}

	[AP] <U>(a: Maybe<Unary<T, U>>): Maybe<U> {
		return map((f) => f(this.v), a)
	}

	[CHAIN] <U> (f: Unary<T, Maybe<U>>): Maybe<U> {
		return f(this.v)
	}

	[REDUCE] <U> (f: Fold<T, U>, seed: U): U {
		return f(seed, this.v)
	}

	[EQUALS](b: unknown): boolean {
		return b instanceof Just && b.v === this.v
	}
}

class Nothing extends M {

	[MAP] (): Nothing {
		return this
	}

	[AP] (): Nothing {
		return this
	}

	[CHAIN](): Nothing {
		return this
	}

	[REDUCE] <U> (_f: Fold<unknown, U>, seed: U): U {
		return seed
	}

	[EQUALS](b: unknown): boolean {
		return b instanceof Nothing
	}
}

export const nothing = new Nothing()

export function maybeOf <T> (v: T): Maybe<T> {
	return new Just(v)
}
