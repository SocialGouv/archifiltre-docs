
import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as Cache from 'cache'

import { generateRandomString } from 'random-gen'

import { Map, Record, List } from 'immutable'




const Entry = Record({
  name:'',
  content:null,
  children:List(),
  parent:null,
  depth:0,
  
  sum_children_path_length:0,
  max_children_path_length:0,
  parent_path_length:0,
})

export const isLeaf = (a) => a.get('children').size === 0
export const isRoot = (a) => a.get('parent') === null

export const getMaxRemainingPathLength = (a) => a.get('max_children_path_length') + a.get('name').length



const TableTree = Record({
  table:Map(),
  root_id:'',
})

const empty = () => {
  return new TableTree()
}

const getTable = (tt) => tt.get('table')
const setTable = (a,tt) => tt.set('table',a)
const updateTable = (f,tt) => tt.update('table',f)

const getIdArray = (tt) => {
  const [ ...keys ] = getTable(tt).keys()
  return keys
}

export const getRootId = (tt) => tt.get('root_id')
const setRootId = (a,tt) => tt.set('root_id',a)

const genId = () => generateRandomString(40)

export const init = (content) => {
  const root_id = genId()
  const table = Map({
    [root_id]:new Entry({content})
  })
  let ans = empty()
  ans = setTable(table, ans)
  ans = setRootId(root_id, ans)
  return ans
}

export const size = (tt) => getTable(tt).size

export const getEntryById = (id,tt) => {
  return getTable(tt).get(id)
}

const setEntryById = (id, entry, tt) => {
  return updateTable(t=>t.set(id, entry), tt)
}

export const updateEntryById = (id, f, tt) => {
  return updateTable(t=>t.update(id, entry=>f(entry)), tt)
}

const map = (f, id, tt) => {
  getEntryById(id,tt).get('children').forEach(id => {
    tt = map(f, id, tt)
  })

  tt = updateEntryById(id, entry => f(entry), tt)
  return tt
}

const reduce = (f, id, tt) => {
  const acc_array = []
  getEntryById(id,tt).get('children').forEach(id => {
    acc_array.push(reduce(f, id, tt))
  })

  return f(acc_array, getEntryById(id,tt))
}

const merge = (tt1, tt2) => {
  let ans = empty()
  ans = setTable(getTable(tt1).merge(getTable(tt2)), ans)
  return ans
}

const filter = (f, tt) => {
  tt = setTable(getTable(tt).filter(f), tt)
  return tt
}




const arbitraryPath = () => Arbitrary.array(
  () => 'p' + Math.round(Math.random() * 1)
)



export const arbitrary = (updater, arbitrary) => () => {
  let a = init(arbitrary())
  const uF = update(updater)

  for (let i = 0; i < Math.random()*50; i++) {
    a = uF(arbitraryPath(), arbitrary(), a)
  }

  return a
}

const updateChildren = (child_id, entry) => {
  entry = entry.update('children', a=>a.push(child_id))
  return entry
}

const strPathLen = (path) => {
  return path.join('').length
}

const entryUpdater = (updater, content, path) => entry => {
  entry = updateContent(updater, content, entry)
  const len = strPathLen(path)
  entry = entry.update('sum_children_path_length',a=>a+len)
  entry = entry.update('max_children_path_length',a=>Math.max(a,len))
  return entry
}




const updateContent = (updater, content, entry) => {
  entry = entry.update('content', a=>updater(content,a))
  return entry
}

const getChildIdByName = (name, id, tt) => {
  const list = getEntryById(id, tt).get('children')
    .filter(child_id=>getEntryById(child_id, tt).get('name')===name)
  if (list.size) {
    return list.get(0)
  } else {
    return null
  }
}



const updateRec = (updater, path, content, id, tt) => {
  if (path.length===0) {
    return tt
  } else {
    const name = path[0]
    path = path.slice(1)

    let child_id = getChildIdByName(name, id, tt)
    if (child_id) {
      tt = updateEntryById(child_id, entryUpdater(updater, content, path), tt)
    } else {
      child_id = genId()
      const path_len = strPathLen(path)
      const parent_entry = getEntryById(id, tt)
      const child = new Entry({
        name,
        content,
        parent:id,
        depth: parent_entry.get('depth') + 1,

        parent_path_length: parent_entry.get('parent_path_length') + parent_entry.get('name').length,
        max_children_path_length: path_len,
        sum_children_path_length: path_len,
      })
      tt = setEntryById(child_id, child, tt)
      tt = updateEntryById(id, a=>updateChildren(child_id, a), tt)
    }
    return updateRec(updater, path, content, child_id, tt)
  }
}


export const update = (updater) => (path, content, tt) => {
  const root_id = getRootId(tt)
  tt = updateEntryById(root_id, entryUpdater(updater, content, path), tt)

  tt = updateRec(updater, path, content, root_id, tt)

  return tt
}




const sortChildren = (tt, getObj, compare, entry) => {
  const comparator = ([id1,content1], [id2,content2]) =>
    compare(content1,content2)

  entry = entry.update('children', children =>
    children.map(child_id => [child_id, getObj(child_id, tt)])
      .sort(comparator)
      .map(([child_id,content]) => child_id)
  )
  return entry
}

const sortRec = (id, getObj, compare, tt) => {
  tt = updateEntryById(id, a=>sortChildren(tt, getObj, compare, a), tt)

  getEntryById(id, tt).get('children').forEach(id => tt = sortRec(id, getObj, compare, tt))

  return tt
}

export const sort = (compare) => (tt) => {
  const root_id = getRootId(tt)
  const getObj = (child_id, tt) => getEntryById(child_id,tt).get('content')

  tt = sortRec(root_id, getObj, compare, tt)
  return tt
}

export const sortByMaxRemainingPathLength = (tt) => {
  const root_id = getRootId(tt)
  const getObj = (child_id, tt) => getEntryById(child_id,tt)
  const compare = (a,b) => {
    const len_a = getMaxRemainingPathLength(a)
    const len_b = getMaxRemainingPathLength(b)
    if (len_a < len_b) {
      return 1
    } else if (len_a > len_b) {
      return -1
    } else {
      return 0
    }
  }

  tt = sortRec(root_id, getObj, compare, tt)
  return tt
}

const isSortedRec = (id, compare, tt) => {
  const getContentFromId = (id) => getEntryById(id,tt).get('content')
  const children = getEntryById(id,tt).get('children')
  let ans = true
  for (let i = 1; i < children.size; i++) {
    ans = ans && compare(
      getContentFromId(children.get(i-1)),
      getContentFromId(children.get(i))
    ) !== 1
  }
  return children.map(a=>isSortedRec(a,compare,tt)).reduce((acc,val)=>acc && val, ans)
}

export const isSorted = (compare) => (tt) => {
  const root_id = getRootId(tt)

  return isSortedRec(root_id, compare, tt)
}



export const remakePath = (id, tt) => {
  const entry = getEntryById(id, tt)
  const name = entry.get('name')
  const parent_id = entry.get('parent')

  if (parent_id) {
    return remakePath(parent_id,tt).push(name)
  } else {
    return List.of(name)
  }
}

export const getIdPath = (id, tt) => {
  const entry = getEntryById(id, tt)
  const parent_id = entry.get('parent')

  if (parent_id) {
    return getIdPath(parent_id,tt).push(id)
  } else {
    return List.of(id)
  }
}



export const toStrList2 = (toStrListHeader, toStrList) => (tt, tags) => {
  const table = getTable(tt)

  const mapper = (entry,id) =>
    List.of('', remakePath(id, tt).slice(1).join('/'))
      .concat(toStrList(entry.get('content')))
      .concat(tags.reduce((acc, val, i) => {return (val.has(id) ? (acc.length > 0 ? acc + ", " + i : i) : acc)}, "").toString())
  const header = List.of('', 'path').concat(toStrListHeader())
  return (
    table.map(mapper).reduce((acc,val) => acc.push(val), List.of(header))
  )
}


export const toList = (tt) => reduce((acc_array, e) => {
  return acc_array.reduce((acc,val) => acc.concat(val), List())
    .push(e)
    .map(e=>e.set('children', List()))
    .map(e=>e.set('parent', null))
}, getRootId(tt), tt)

export const mapContent = (f, tt) => map(e=>e.update('content',f), getRootId(tt), tt)


export const toJson = (toJson) => (tt) => {
  tt = mapContent(toJson, tt)
  return JSON.stringify(tt.toJS())
}
export const fromJson = (fromJson) => (json) => {
  let ans = new TableTree(JSON.parse(json))
  ans = updateTable(t => {
    return Map(t).map(e=> {
      return new Entry(e)
        .update('content', fromJson)
        .update('children', List)
    })
  }, ans)
  return ans
}


export const toJs = (toJs) => (tt) => {
  tt = mapContent(toJs, tt)
  return tt.toJS()
}
export const fromJs = (fromJs) => (js) => {
  let ans = new TableTree(js)
  ans = updateTable(t => {
    return Map(t).map(e=> {
      return new Entry(e)
        .update('content', fromJs)
        .update('children', List)
    })
  }, ans)
  return ans
}

export const toJsTree = (tt) => reduce((acc_array, e) => {
  return e.set('children', acc_array)
          .set('parent', null)
          .toJS()
}, getRootId(tt), tt)

const fromJsTreeRec = (js_t) => {
  let [children, tt] = js_t.children
    .map(fromJsTreeRec)
    .reduce((acc, val) => {
      return [
        acc[0].concat(val[0]),
        merge(acc[1],val[1])
      ]
    },
      [[], empty()]
    )

  const id = genId()
  tt = setEntryById(id, new Entry(js_t).set('children', List(children)), tt)
  children.forEach(id_child => {
    tt = updateEntryById(id_child, a=>a.set('parent',id), tt)
  })
  tt = setRootId(id,tt)

  return [[id], tt]
}

export const fromJsTree = (js_t) => {
  const [ids, tt] = fromJsTreeRec(js_t)
  return tt
}

export const depth = Cache.make((tt) => reduce((acc_array, e) => {
  return acc_array.reduce((a, b) => Math.max(a, b), e.get('depth'))
}, getRootId(tt), tt))

export const getLeafIdArray = (tt) => {
  tt = filter(isLeaf,tt)
  return getIdArray(tt)
}

export const getSubIdList = (id, tt) => {
  const entry = getEntryById(id, tt)
  const children_id = entry.get('children')

  return children_id.map(id=>getSubIdList(id, tt)).flatten().push(id)
}


















// const entryToCommon = a => {
//   return Map({
//     name:a.get('name'),
//     content:a.get('content'),
//     children:a.get('children'),
//     parent:a.get('parent'),
//     depth:a.get('depth'),
//   })
// }
// export const v5ToCommon = (v5ToCommon) => (a) => {
//   const table = a.get('table').map(entry=>{
//     entry = entry.update('content',v5ToCommon)
//     return entryToCommon(entry)
//   })
//   const root_id = a.get('root_id')

//   return Map({
//     table,
//     root_id,
//   })
// }
// export const toCommon = (toCommon) => (a) => {
//   a = mapContent(toCommon, a)
//   const table = a.get('table').map(entryToCommon)
//   const root_id = a.get('root_id')

//   return Map({
//     table,
//     root_id,
//   })
// }
// export const fromV5 = (fromV5) => (a) => {
//   const table = a.get('table').map(entry=>{
//     entry = entry.update('content', fromV5)
//     return new Entry(entry)
//   })
//   const root_id = a.get('root_id')
//   return new TableTree({
//     table,
//     root_id,
//   })
// }

