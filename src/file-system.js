
import { Map, List, Record } from 'immutable'
import { generateRandomString } from 'random-gen'
import duck from 'reducers/duck'

import * as Content from 'content'
import * as Arbitrary from 'test/arbitrary'
import * as Loop from 'test/loop'
import tT from 'table-tree'
const TT = tT(Content)


const type = 'cheapExp/database'


const QueueElem = Record({
  path:List(),
  content:null
})

const arbitraryPath = () => List(Arbitrary.array(
  () => 'p' + Math.round(Math.random() * 1)
))

export const arbitraryQe = () => {
  return new QueueElem({
    path:arbitraryPath(),
    content:Content.arbitrary()
  })
}

export const qeToJson = a => {
  a = a.update('path', a=>a.toJS())
  a = a.update('content', Content.toJson)
  a = JSON.stringify(a.toJS())
  return a
}

export const qeFromJson = a => {
  a = new QueueElem(JSON.parse(a))
  a = a.update('path', List)
  a = a.update('content', Content.fromJson)
  return a
}

const Fs = Record({
  content_queue:List(),
  nb_push:0,
  tree:null,
  parent_path:List(),
})


const arbitraryStrPath = () => arbitraryPath().join('/')

export const arbitrary = () => {
  let ans = empty()
  for (let i = Arbitrary.index()*2 - 1; i >= 0; i--) {
    ans = pushOnQueue(arbitraryStrPath(),Content.arbitrary(), ans)
  }
  ans = makeTree(ans)
  ans = sort(ans)
  return ans
}

export const empty = () => new Fs({
  tree:TT.init(Content.create())
})

export const size = (state) => state.get('content_queue').size

export const depth = (state) => TT.depth(state.get('tree'))

export const parentPath = (state) => {
  return state.get('parent_path').toArray()
}

export const getByID = (id, state) => TT.getEntryById(id, state.get('tree'))

export const volume = (state) => {
  return Content.getSize(getByID(rootId(state), state))
}

export const rootId = (state) => TT.getRootId(state.get('tree'))

export const pushOnQueue = (path, content, state) => {
  state = state.update(
    'content_queue',
    a=> a.push(new QueueElem({
      path:List(path.split('/')),
      content: Content.create(content)
    }))
  )

  state = state.update('depth', a=>Math.max(a, path.length))

  return state
}

export const makeTree = (state) => {
  state = state.update('tree', tree => {
    tree = tree.asMutable()
    state.get('content_queue').forEach(val => {
      tree = TT.update(val.get('path').toJS(), val.get('content'), tree)
    })
    return tree.asImmutable()
  })

  return state
}

export const sort = (state) => {
  state = state.update('tree', TT.sort)

  return state
}


export const toJson = (state) => {
  state = state.update('tree', TT.toJson)
  state = state.update('content_queue', a=>a.map(qeToJson))
  return JSON.stringify(state.toJS())
}

export const fromJson = (json) => {
  let state = new Fs(JSON.parse(json))
  state = state.update('content_queue', cq=>List(cq).map(qeFromJson))
  state = state.update('tree', TT.fromJson)
  state = state.update('parent_path', List)

  return state
}


export const setParentPath = (parent_path, state) =>
  state.set('parent_path', List(parent_path))

