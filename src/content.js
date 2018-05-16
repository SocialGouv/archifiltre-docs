
import { Record, List, Set } from 'immutable'

import * as Arbitrary from 'test/arbitrary'


const Content = Record({
  size:0,
  last_modified:null,
  error_is_file:false,
  alias:'',
  comments: '',
  tags: Set(),
})

export const arbitraryTags = () => {
  return Set(Arbitrary.array(Arbitrary.string))
}

export const tagsToJs = a => a.toArray()
export const tagsFromJs = a => Set(a)


export const arbitrary = () => new Content({
  size: Arbitrary.natural(),
  last_modified: Arbitrary.natural(),
  error_is_file: Arbitrary.nullable(Arbitrary.bool),
  alias: Arbitrary.string(),
  comments: Arbitrary.string(),
  tags: arbitraryTags(),
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

export const getAlias = (a) => a.get('alias')
export const setAlias = (s, a) => a.set('alias', s)

export const getComments = (a) => a.get('comments')
export const setComments = (s, a) => a.set('comments', s)

export const getTags = (a) => a.get('tags')
export const setTags = (s, a) => a.set('tags', s)


export const toJs = (a) => {
  a = a.update('tags', tagsToJs)
  a = a.toJS()
  return a
}
export const fromJs = (a) => {
  a = new Content(a)
  a = a.update('tags', tagsFromJs)
  return a
}

export const toJson = (a) => JSON.stringify(toJs(a))
export const fromJson = (a) => {
  return fromJs(JSON.parse(a))
}

