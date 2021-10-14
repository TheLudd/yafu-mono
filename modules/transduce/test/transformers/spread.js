import { assert } from 'chai'
import { spread, into } from '../../index.js'

const { deepEqual } = assert

const getTags = ({ tags }) => tags

const list = [
  { tags: [ 'a', 'b', 'c' ] },
  { tags: [ 'd', 'e', 'f' ] },
]

it('spread', () => {
  const result = into(
    [],
    spread(getTags),
    list,
  )
  deepEqual(result, [ 'a', 'b', 'c', 'd', 'e', 'f' ])
})
