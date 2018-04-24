

import { generateRandomString } from 'random-gen'

import { Map, Record, List } from 'immutable'


const Entry = Record({
  name:'default_name',
  size:0,
  children:List(),
  parent:null,
  depth:0
})


const updateSize = (size, entry) => {
  entry = entry.update('size', a=>a+size)
  return entry
}

const updateChildren = (child_id, entry) => {
  entry = entry.update('children', a=>a.push(child_id))
  return entry
}

const sortChildren = (map, entry) => {
  const getSize = (child_id, map) => map.get(child_id).get('size')
  const comparator = ([id1,size1], [id2,size2]) => size1 < size2

  entry = entry.update('children', children =>
    children.map(child_id => [child_id, getSize(child_id, map)])
      .sort(comparator)
      .map(([child_id,size]) => child_id)
  )
  return entry
}

const getChildIdByName = (name, id, map) => {
  const list = map.get(id).get('children')
    .filter((child_id=>map.get(child_id).get('name')===name))
  if (list.size) {
    return list.get(0)
  } else {
    return null
  }
}

const genId = () => generateRandomString(40)

const updateRec = (path, size, id, map) => {
  if (path.length===0) {
    return map
  } else {
    const name = path[0]
    path = path.slice(1)
    let child_id = getChildIdByName(name, id, map)
    if (child_id) {
      map = map.update(child_id, a=>updateSize(size, a))
    } else {
      child_id = genId()
      const child = new Entry({
        name,
        size,
        parent:id,
        depth: map.get(id).get('depth')+1
      })
      map = map.set(child_id, child)
      map = map.update(id, a=>updateChildren(child_id, a))
    }
    map = map.update(id, a=>sortChildren(map,a))
    return updateRec(path, size, child_id, map)
  }
}

export const update = (path, size, root_id, map) => {
  map = map.update(root_id, a=>updateSize(size, a))

  map = updateRec(path, size, root_id, map)

  return map
}


export const init = (name) => {
  return Map({
    [genId()]:new Entry({name})
  })
}

export const getRootIdArray = (map) => {
  return map.filter(entry => entry.get('parent')===null).keySeq().toArray()
}

export const remakePath = (id,map) => {
  const entry = map.get(id)
  const parent_id = entry.get('parent')
  if (parent_id) {
    return remakePath(parent_id,map).push(entry.get('name'))
  } else {
    return List.of(entry.get('name'))
  }
}

export const getEntryById = (id,map) => {
  return map.get(id)
}

export const getIdList = (map) => {
  return map.keySeq().toArray()
}


export const toCsvList = (map) => {
  const leaf = map.filter(entry => entry.get('children').isEmpty())
  return (
    leaf.map((entry,id) => List.of(remakePath(id, map).slice(1),entry.get('size')))
        .reduce((acc,val) => acc.push(val), List())
  )
}

export const toTree = (id,map) => {
  let entry = map.get(id)
  entry = entry.update('children', children =>
    children.map(id=>toTree(id,map))
  )
  entry = entry.update('parent',()=>null)
  return entry
}