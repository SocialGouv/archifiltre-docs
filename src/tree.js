

import { generateRandomString } from 'random-gen'

import { Map, Record, List } from 'immutable'



// const graftBranch2Tree = (branch,tree) => {
//   tree.size += branch.size
//   const child = branch.children[0]
//   if (child) {
//     const matching_child = tree.children.filter(e=>e.name===child.name)[0]
//     if (matching_child) {
//       graftBranch2Tree(child,matching_child)
//     } else {
//       tree.children.push(child)
//     }
//   }
// }

// const makeBranch = (path,size) => {
//   const rev_path = path.slice().reverse()
//   const head = rev_path.shift()
//   return rev_path.reduce((acc,val) => {
//     return {
//       id:generateRandomString(40),
//       name:val.toString(),
//       size,
//       children:[acc]
//     }
//   },{
//     id:generateRandomString(40),
//     name:head.toString(),
//     size,
//     children:[]
//   })
// }







const init = (name) => {
  return Map({
    [genId()]:new Entry({name})
  })
}

const getRootIds = (map) => {
  return map.filter(entry => entry.get('parent')===null).keySeq().toArray()
}


const Entry = Record({
  name:'default_name',
  size:0,
  children:List(),
  parent:null,
})


const updateSize = (size, entry) => {
  entry = entry.update('size', a=>a+size)
  return entry
}

const updateChildren = (child_id, entry) => {
  entry = entry.update('children', a=>a.push(child_id))
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
        parent:id
      })
      map = map.set(child_id, child)
      map = map.update(id, a=>updateChildren(child_id, a))
    }
    return updateRec(path, size, child_id, map)
  }
}

const update = (path, size, root_id, map) => {
  map = map.update(root_id, a=>updateSize(size, a))

  map = updateRec(path, size, root_id, map)

  return map
}

let a = init('baba')
const root_id = getRootIds(a)[0]

a = update(['a','b','c'], 1, root_id, a)
a = update(['a','b','d'], 1, root_id, a)
a = update(['a','e','f'], 1, root_id, a)
console.log(a)
console.log(a.toJS())


window.a = a