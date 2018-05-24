
import { Map, List, Record } from 'immutable'
import { generateRandomString } from 'random-gen'
import duck from 'reducers/duck'

import * as Cache from 'cache'
import * as Content from 'content'
import * as Arbitrary from 'test/arbitrary'
import * as Loop from 'test/loop'
import tT from 'table-tree'
export const TT = tT(Content)


const QueueElem = Record({
  path:List(),
  content:null
})

export const makeQueueElem = (path,content) => {
  return new QueueElem({
    path:List(path.split('/')),
    content: Content.create(content)
  })
}

const arbitraryPath = () => List(Arbitrary.array(
  () => 'p' + Math.round(Math.random() * 1)
))

export const arbitraryQe = () => {
  return new QueueElem({
    path:arbitraryPath(),
    content:Content.arbitrary()
  })
}

export const qeToJs = a => {
  a = a.update('path', a=>a.toJS())
  a = a.update('content', Content.toJs)
  a = a.toJS()
  return a
}

export const qeFromJs = a => {
  a = new QueueElem(a)
  a = a.update('path', List)
  a = a.update('content', Content.fromJs)
  return a
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
  session_name:'Untitled',
  version:5,
  content_queue:List(),
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

export const size_files = (state) => state.get('content_queue').size
export const size_overall = (state) => state.get('tree').get('table').size - 1

export const depth = (state) => TT.depth(state.get('tree'))

export const parentPath = (state) => {
  return state.get('parent_path').toArray()
}

const getVersion = (state) => state.get('version')
const setVersion = (a,state) => state.set('version',a)

export const getByID = (id, state) => TT.getEntryById(id, state.get('tree'))
export const setByID = (id, entry, state) =>
  state.update('tree',a=>TT.setEntryById(id, entry, a))
export const updateByID = (id, f, state) =>
  state.update('tree',a=>TT.updateEntryById(id, f, a))


export const getSessionName = (state) => state.get('session_name')
export const setSessionName = (a, state) => state.set('session_name',a)

export const ghostTreeFromJs = (js, state) => {
  state = state.set('tree', TT.fromJs(js))
  return state
}

export const arbitraryContentQueue = () => {
  return Arbitrary.immutableList(arbitraryQe)
}

export const contentQueueToJs = (a) => {
  a = a.map(qeToJs)
  a = a.toJS()
  return a
}

export const contentQueueFromJs = (a) => {
  a = List(a)
  a = a.map(qeFromJs)
  return a
}

export const ghostQueueFromJs = (js,state) => {
  state = state.set('content_queue', contentQueueFromJs(js))
  return state
}

export const volume = (state) => {
  return Content.getSize(getByID(rootId(state), state).get('content'))
}

export const rootId = (state) => TT.getRootId(state.get('tree'))

export const pushOnQueue = (path, content, state) => {
  state = state.update(
    'content_queue',
    a=> a.push(makeQueueElem(path,content))
  )

  return state
}

export const updateTreeWithQueueElem = (queue_elem,tree) => {
  tree = TT.update(queue_elem.get('path').toJS(), queue_elem.get('content'), tree)
  return tree
}

export const makeTree = (state) => {
  state = state.update('tree', tree => {
    tree = tree.asMutable()
    state.get('content_queue').forEach(queue_elem => {
      tree = updateTreeWithQueueElem(queue_elem, tree)
    })
    return tree.asImmutable()
  })

  return state
}

export const sort = (state) => {
  state = state.update('tree', TT.sort)

  return state
}


export const toJson = Cache.make((state) => {
  state = state.update('tree', TT.toJson)
  state = state.update('content_queue', a=>a.map(qeToJson))
  return JSON.stringify(state.toJS())
})

export const fromJson = (json) => {
  let state = new Fs(JSON.parse(json))
  state = state.update('content_queue', cq=>List(cq).map(qeFromJson))
  state = state.update('tree', TT.fromJson)
  state = state.update('parent_path', List)

  return state
}

export const toStrList2 = Cache.make((state) => {
  return TT.toStrList2(state.get('tree'))
})

export const setParentPath = (parent_path, state) =>
  state.set('parent_path', List(parent_path))


export const fromLegacyCsv = (csv) => {
  const parseLine = (a) =>
    a.match(/(".*?")|([^,"\s]*)/g)
      .filter(a=>a!=="")
      .map(a=>a.replace(/"/g,''))
  let ans = setVersion(4, empty())
  const lines = csv.split('\n')
    .filter(a=>a!=='')
    .map(parseLine)
    .forEach(([path,size])=>{
      ans = pushOnQueue(path, Content.create({size:Number(size)}), ans)
    })
  ans = makeTree(ans)
  ans = sort(ans)
  return ans
}

export const getIDPath = (id, state) => {
  return TT.getIdPath(id, state.get('tree'))
}
