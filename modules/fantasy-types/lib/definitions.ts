export interface FantasyDefinition {
  name: string
  generics: string[]
  args: string[]
  returnType: string
  extending?: string[]
  extendingGenerics?: string[]
  isStatic?: boolean
}

export const definitions: Record<string, FantasyDefinition> = {
  equals: {
    name: 'Setoid',
    generics: [],
    args: ['_any'],
    returnType: 'boolean',
  },
  lte: {
    name: 'Ord',
    generics: [],
    extending: ['Setoid'],
    args: ['_any'],
    returnType: 'boolean',
  },
  compose: {
    name: 'Semigroupoid',
    generics: ['T'],
    args: [`Semigroupoid<T>`],
    returnType: 'Semigroupoid<T>',
  },
  id: {
    name: 'Category',
    generics: ['T'],
    extending: ['Semigroupoid'],
    args: [],
    isStatic: true,
    returnType: 'Category<T>',
  },
  concat: {
    name: 'Semigroup',
    generics: ['T'],
    args: ['Semigroup<T>'],
    returnType: 'Semigroup<T>',
  },
  empty: {
    name: 'Monoid',
    generics: ['T'],
    extending: ['Semigroup'],
    args: [],
    isStatic: true,
    returnType: 'Monoid<T>',
  },
  invert: {
    name: 'Group',
    generics: ['T'],
    extending: ['Monoid'],
    args: [],
    returnType: 'Group<T>',
  },
  filter: {
    name: 'Filterable',
    generics: ['T'],
    args: ['Predicate<T>'],
    returnType: 'Filterable<T>',
  },
  map: {
    name: 'Functor',
    generics: ['T'],
    args: ['Unary<T, U>'],
    returnType: 'Functor<U>',
  },
  contramap: {
    name: 'Contravariant',
    generics: ['T'],
    args: ['Unary<U, T>'],
    returnType: 'Contravariant<U>',
  },
  ap: {
    name: 'Apply',
    generics: ['T'],
    extending: ['Functor'],
    args: ['Apply<Unary<T, U>>'],
    returnType: 'Apply<U>',
  },
  of: {
    name: 'Applicable',
    generics: [],
    extending: ['Apply'],
    args: ['A'],
    isStatic: true,
    returnType: 'Applicable',
  },
  alt: {
    name: 'Alt',
    generics: ['T'],
    extending: ['Functor'],
    args: ['Alt<T>'],
    returnType: 'Alt<T>',
  },
  zero: {
    name: 'Plus',
    generics: ['T'],
    extending: ['Alt'],
    args: [],
    isStatic: true,
    returnType: 'Plus<T>',
  },
  reduce: {
    name: 'Foldable',
    generics: ['T'],
    args: ['Fold<T, U>', 'U'],
    returnType: 'U',
  },
  traverse: {
    name: 'Traversable',
    generics: ['T'],
    extending: ['Functor', 'Foldable'],
    args: ['_constructor:Applicable<T>', 'Unary<T, Applicable<U>>'],
    returnType: 'Applicable<Traversable<U>>',
  },
  chain: {
    name: 'Chain',
    generics: ['T'],
    extending: ['Apply'],
    args: ['Unary<T, Chain<U>>'],
    returnType: 'Chain<U>',
  },
  chainRec: {
    name: 'ChainRec',
    generics: ['T'],
    extending: ['Chain'],
    args: ['Unary<T, U>', 'Unary<U, U>', 'T'],
    returnType: 'ChainRec<U>',
    isStatic: true,
  },
  extend: {
    name: 'Extend',
    generics: ['T'],
    extending: ['Functor'],
    args: ['Unary<Extend<T>, U>'],
    returnType: 'Extend<U>',
  },
  extract: {
    name: 'Comonad',
    generics: ['T'],
    extending: ['Extend'],
    args: [],
    returnType: 'T',
  },
  bimap: {
    name: 'Bifunctor',
    generics: ['T', 'U'],
    extending: ['Functor'],
    extendingGenerics: ['U'],
    args: ['Unary<T, V>', 'Unary<U, Z>'],
    returnType: 'Bifunctor<V, Z>',
  },
  promap: {
    name: 'Promap',
    generics: ['T', 'U'],
    extending: ['Functor'],
    extendingGenerics: ['U'],
    args: ['Unary<V, T>', 'Unary<U, Z>'],
    returnType: 'Promap<V, Z>',
  },
}
