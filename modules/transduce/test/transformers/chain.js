import { assert } from 'chai'
import chain from '../../lib/transformers/chain.js'
import into from '../../lib/into.js'

const { deepEqual } = assert

const getTags = ({ tags }) => tags

const list = [
  { tags: [ 'a', 'b', 'c' ] },
  { tags: [ 'd', 'e', 'f' ] },
]

it('chain', () => {
  const result = into(
    [],
    chain(getTags),
    list,
  )
  deepEqual(result, [ 'a', 'b', 'c', 'd', 'e', 'f' ])
})
