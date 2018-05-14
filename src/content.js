
import { Record, List } from 'immutable'

import * as Arbitrary from 'test/arbitrary'


const Content = Record({
  size:0,
  last_modified:NaN,
  error_is_file:false
})

export const arbitrary = () => new Content({
  size: Arbitrary.natural(),
  last_modified: Arbitrary.natural(),
  error_is_file: Arbitrary.nullable(Arbitrary.bool)
})

export const create = a => new Content(a)

export const compare = (a,b) => {
  if (a.get('size') === b.get('size')) {
    return 0
  } else if (a.get('size') > b.get('size')) {
    return -1
  } else {
    return 1
  }
}

export const update = (young,old) => {
  const size = young.get('size')
  old = old.update('size', a=>a+size)
  return old
}


export const toStrListHeader = () => List.of('size (octet)', 'last_modified')
export const toStrList = (a) => List.of(a.get('size'), new Date(a.get('last_modified')))



export const getSize = (a) => a.get('size')
export const setSize = (s, a) => a.set('size', s)

export const getLastModified = (a) => a.get('last_modified')
export const setLastModified = (s, a) => a.set('last_modified', s)

export const toJs = (a) => a.toJS()
export const fromJs = (a) => new Content(a)

export const toJson = (a) => JSON.stringify(toJs(a))
export const fromJson = (a) => {
  return fromJs(JSON.parse(a))
}

