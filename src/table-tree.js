

import { generateRandomString } from 'random-gen'

import { Map, Record, List } from 'immutable'

const Entry = Record({
  name:'',
  content:null,
  children:List(),
  parent:null,
  depth:0
})

export const mkDummyFile = () => new Entry({children:List(), name:''})
export const mkDummyParent = () => new Entry({children:List(["-1"]), name:''})

export default function(update_, compare_, toCsvList_) {




  const updateChildren = (child_id, entry) => {
    entry = entry.update('children', a=>a.push(child_id))
    return entry
  }

  const updateContent = (content, entry) => {
    entry = entry.update('content', a=>update_(content,a))
    return entry
  }

  const sortChildren = (map, entry) => {
    const getObj = (child_id, map) => map.get(child_id).get('content')
    const comparator = ([id1,content1], [id2,content2]) =>
      compare_(content1,content2)

    entry = entry.update('children', children =>
      children.map(child_id => [child_id, getObj(child_id, map)])
        .sort(comparator)
        .map(([child_id,content]) => child_id)
    )
    return entry
  }

  const getChildIdByName = (name, id, map) => {
    const list = map.get(id).get('children')
      .filter(child_id=>map.get(child_id).get('name')===name)
    if (list.size) {
      return list.get(0)
    } else {
      return null
    }
  }



  const genId = () => generateRandomString(40)

  const updateRec = (path, content, id, map) => {
    if (path.length===0) {
      return map
    } else {
      const name = path[0]
      path = path.slice(1)
      const child = new Entry({
        name,
        content,
        parent:id,
        depth: map.get(id).get('depth')+1
      })
      let child_id = getChildIdByName(name, id, map)
      if (child_id) {
        map = map.update(child_id, a=>updateContent(content, a))
      } else {
        child_id = genId()
        map = map.set(child_id, child)
        map = map.update(id, a=>updateChildren(child_id, a))
      }
      map = map.update(id, a=>sortChildren(map,a))
      return updateRec(path, content, child_id, map)
    }
  }


  const update = (path, content, root_id, map) => {
    map = map.update(root_id, a=>updateContent(content, a))

    map = updateRec(path, content, root_id, map)

    return map
  }


  const init = (content) => {
    return Map({
      [genId()]:new Entry({content})
    })
  }

  const getRootIdArray = (map) => {
    return map.filter(entry => entry.get('parent')===null).keySeq().toArray()
  }

  const remakePath = (id,map) => {
    const entry = map.get(id)
    const name = entry.get('name')
    const parent_id = entry.get('parent')

    if (parent_id) {
      return remakePath(parent_id,map).push(name)
    } else {
      return List.of(name)
    }
  }

  const getEntryById = (id,map) => {
    return map.get(id)
  }

  const getIdList = (map) => {
    return map.keySeq()
  }


  const toCsvList = (map) => {
    const leaf = map.filter(entry => entry.get('children').isEmpty())
    const mapper = (entry,id) =>
      List.of(remakePath(id, map).slice(1))
        .concat(toCsvList_(entry.get('content')))
    return (
      leaf.map(mapper)
        .reduce((acc,val) => acc.push(val), List())
    )
  }

  const toTree = (id,map) => {
    let entry = map.get(id)
    entry = entry.update('children', children =>
      children.map(id=>toTree(id,map))
    )
    entry = entry.update('parent',()=>null)
    return entry
  }

  return {
    update,
    init,
    getRootIdArray,
    remakePath,
    getEntryById,
    getIdList,
    toCsvList,
    toTree
  }
}
