
import { Record, List, Set, Map } from 'immutable'

import * as Arbitrary from 'test/arbitrary'


const LastModified = Record({
  max:0,
  list:List(),
  min:Number.MAX_SAFE_INTEGER,
  median:null,
  average:null,
})

export const arbitraryLastModified = () => {
  const list = Arbitrary.immutableList(Arbitrary.natural)
  return new LastModified({
    max:list.max(),
    list,
    min:list.min()
  })
}

export const lastModifiedToJs = a => {
  a = a.update('list',a=>a.toJS())
  a = a.toJS()
  return a
}
export const lastModifiedFromJs = a => {
  a = new LastModified(a)
  a = a.update('list',List)
  return a
}

const createLastModified = (last_modified) => {
  return new LastModified({
    max:last_modified,
    list:List.of(last_modified),
    min:last_modified,
    median:last_modified,
    average:last_modified,
  })
}

const updateLastModified = (young,old) => {
  const time = young.get('max')
  old = old.update('max',max=>Math.max(max,time))
  old = old.update('min',min=>Math.min(min,time))
  old = old.update('list',l=>l.push(time))

  return old
}

const median = l => {
  if (l.size % 2 === 1) {
    return l.get(Math.floor(l.size/2))
  } else {
    const i = l.size/2
    return (l.get(i-1) + l.get(i)) / 2
  }
}

const average = l => {
  const sum = l.reduce((acc,val)=>acc+val,0)
  return sum/l.size
}

const computeDerivatedDataLastModified = (a) => {
  const list = a.get('list')
  a = a.set('median',median(list))
  a = a.set('average',average(list))

  return a
}


const Content = Record({
  size:0,
  nb_files:1,
  last_modified:new LastModified(),
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
  nb_files: Arbitrary.natural(),
  last_modified: arbitraryLastModified(),
  alias: Arbitrary.string(),
  comments: Arbitrary.string(),
  tags: arbitraryTags(),
})

export const create = a => {
  if (a) {
    a.last_modified = createLastModified(a.last_modified)
  }
  return new Content(a)
}

export const compareSize = (a,b) => {
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
  const time = young.get('last_modified').get('max')
  old = old.update('last_modified',
    a=>updateLastModified(young.get('last_modified'),a)
  )
  old = old.update('nb_files', a=>a+1)
  return old
}

export const computeDerivatedData = a => {
  a = a.update('last_modified',computeDerivatedDataLastModified)

  return a
}



export const toStrListHeader = () => List.of(
  'size (octet)',
  'last_modified',
  'comments',
  'tags'
)
export const toStrList = (a) => List.of(
  a.get('size'),
  new Date(a.get('last_modified').get('max')),
  a.get('comments'),
  tagsToJs(a.get('tags')).toString()
)



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
  a = a.update('last_modified', lastModifiedToJs)
  a = a.toJS()
  return a
}
export const fromJs = (a) => {
  a = new Content(a)
  a = a.update('last_modified', lastModifiedFromJs)
  a = a.update('tags', tagsFromJs)
  return a
}

export const toJson = (a) => JSON.stringify(toJs(a))
export const fromJson = (a) => {
  return fromJs(JSON.parse(a))
}












export const v5ToCommon = a => {
  return Map({
    size:a.get('size'),
    last_modified:a.get('last_modified'),
    alias:a.get('alias'),
    comments:a.get('comments'),
    tags:a.get('tags'),
  })
}
export const toCommon = (a) => {
  return Map({
    size:a.get('size'),
    last_modified:a.get('last_modified').get('max'),
    alias:a.get('alias'),
    comments:a.get('comments'),
    tags:a.get('tags'),
  })
}
export const fromV5 = (a) => {
  return create({
    size:a.get('size'),
    nb_files:1,
    last_modified:a.get('last_modified'),
    alias:a.get('alias'),
    comments:a.get('comments'),
    tags:a.get('tags'),
  })
}
