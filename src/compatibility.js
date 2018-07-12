
import * as Loop from 'test/loop'

import * as V5 from '../version/v5/src/file-system'
import * as V6 from '../version/v6/src/file-system'
import * as V7 from '../version/v7/src/file-system'

const max = (m,l) => {
  return l.reduce((acc,val)=>Math.max(acc,val),m)
}

const min = (m,l) => {
  return l.reduce((acc,val)=>Math.min(acc,val),m)
}

const median = l => {
  if (l.length % 2 === 1) {
    return l[Math.floor(l.length/2)]
  } else {
    const i = l.length/2
    return (l[i-1] + l[i]) / 2
  }
}

const average = l => {
  const sum = l.reduce((acc,val)=>acc+val,0)
  return sum/l.length
}

const sum = l => {
  return l.reduce((acc,val)=>acc+val,0)
}

const unzip3 = l => {
  return l.reduce((acc,val)=>{
    acc[0].push(val[0])
    acc[1].push(val[1])
    acc[2].push(val[2])
    return acc
  },[[],[],[]])
}


export const v5JsToV6Js = (v5) => {
  const convFs = a => {
    a = Object.assign({},a)
    delete a.nb_push
    a.content_queue = a.content_queue.map(convCq)
    const tags = {}
    a.tree = convTT(tags,a.tree)
    a.tags = tags
    return a
  }

  const convCq = a => {
    a = Object.assign({},a)
    a.content = convContent(a.content)
    return a
  }

  const convContent = a => {
    a = Object.assign({},a)
    delete a.error_is_file
    a.last_modified = {
      max:a.last_modified,
      list:[a.last_modified],
      min:a.last_modified,
      median:a.last_modified,
      average:a.last_modified,
    }
    a.nb_files = 1
    return a
  }


  const convTT = (tags,a) => {
    a = Object.assign({},a)
    a.table = Object.assign({},a.table)

    const reduceSum = arr => arr.reduce((acc,val)=>acc+val,0)
    const reduceLM = arr => {
      const a = {
        list:arr.reduce((acc,val)=>acc.concat(val.list), [])
      }
      a.max = max(0,a.list)
      a.min = min(Number.MAX_SAFE_INTEGER,a.list)
      a.median = median(a.list)
      a.average = average(a.list)
      return a
    }


    const addTag = (tag,id) => {
      if (tags[tag]) {
        if (tags[tag].includes(id) === false) {
          tags[tag].push(id)
        }
      } else {
        tags[tag] = [id]
      }
    }

    const convEntry = (id) => {
      const entry = Object.assign({},a.table[id])
      entry.content = convContent(entry.content)
      entry.max_children_path_length = 0
      entry.sum_children_path_length = 0
      entry.parent_path_length = 0
      entry.content.tags.forEach(addTag)

      const array = unzip3(entry.children.map(convEntry))
      
      if (array[0].length) {
        entry.content.size = sum(array[0])
        entry.content.last_modified = reduceLM(array[1])
        entry.content.nb_files = sum(array[2])
      }

      a.table[id] = entry

      return [
        entry.content.size,
        entry.content.last_modified,
        entry.content.nb_files,
      ]
    }

    convEntry(a.root_id)
    return a
  }

  return convFs(v5)
}





export const v6JsToCommon67 = () => {

}

export const v6JsToV7Js = () => {

}

export const v7JsToCommon67 = () => {

}





export const v7JsToCommon78 = () => {

}

export const v7JsToV8Js = () => {

}

export const v8JsToCommon78 = () => {

}


// // v5 | v6,v7

// TT.v5ToCommon = TT.v5ToCommon(Content.v5ToCommon)
// TT.toCommon = TT.toCommon(Content.toCommon)
// TT.fromV5 = TT.fromV5(Content.fromV5)
// const contentQueueToCommon = (f,a) => {
//   return a.map(e=>{
//     const path = e.get('path')
//     const content = e.update('content',f)
//     return Map({
//       path,
//       content
//     })
//   })
// }
// const makeLastModifiedFromTreeRec = (id,table) => {
//   let node = table.get(id)
//   const children = node.get('children')
//   if (children.size) {
//     children.forEach(child_id=>{
//       table = makeLastModifiedFromTreeRec(child_id,table)
//     })
//     let list = List()
//     children.forEach(child_id=>{
//       const child_node = table.get(child_id)
//       list = list.concat(child_node.get('content').get('last_modified').get('list'))
//     })
//     let max = list.max()
//     let min = list.min()
//     node = node.update('content',a=>a.update('last_modified',last_modified=>{
//       last_modified = last_modified.set('list',list)
//       last_modified = last_modified.set('max',max)
//       last_modified = last_modified.set('min',min)
//       return last_modified
//     }))
//     table = table.set(id,node)
//     return table
//   } else {
//     return table
//   }
// }
// const makeLastModifiedFromTree = (tt) => {
//   const table = tt.get('table')
//   const root_id = tt.get('root_id')

//   tt = tt.set('table', makeLastModifiedFromTreeRec(root_id,table))

//   return tt
// }
// const makeTagsFromTree = (tt) => {
//   let tags = Map()
//   const insert = (id,tag) => {
//     tags = tags.update(tag,s=>{
//       if (s) {
//         return s.add(id)
//       } else {
//         return Set([id])
//       }
//     })
//   }
//   tt.get('table').forEach((val,key) => {
//     val.get('content').get('tags').forEach(tag=>{
//       insert(key,tag)
//     })
//   })
//   return tags
// }
// export const v5ToCommon = (a) => {
//   const session_name = a.get('session_name')
//   const content_queue = contentQueueToCommon(Content.v5ToCommon, a.get('content_queue'))
//   const tree = TT.v5ToCommon(a.get('tree'))
//   const tags = makeTagsFromTree(tree)
//   const parent_path = a.get('parent_path')
//   return Map({
//     session_name,
//     content_queue,
//     tree,
//     tags,
//     parent_path
//   })
// }
// export const toCommon = (a) => {
//   const session_name = a.get('session_name')
//   const content_queue = contentQueueToCommon(Content.toCommon, a.get('content_queue'))
//   const tree = TT.toCommon(a.get('tree'))
//   const parent_path = a.get('parent_path')
//   const tags = a.get('tags')

//   return Map({
//     session_name,
//     content_queue,
//     tree,
//     tags,
//     parent_path
//   })
// }
// export const fromV5 = (a) => {
//   const session_name = a.get('session_name')
//   const version = 6
//   const content_queue = a.get('content_queue').map(a=>{
//     return a.update('content',Content.fromV5)
//   })
//   const tree = TT.fromV5(a.get('tree'))
//   const tags = makeTagsFromTree(tree)
//   const parent_path = a.get('parent_path')

//   return new Fs({
//     session_name,
//     version,
//     content_queue,
//     tree,
//     tags,
//     parent_path
//   })
// }

// const fromJsonV5 = (a) => {
//   a = fromV5(V5.fromJson(a))
//   a = a.update('tree', makeLastModifiedFromTree)
//   a = computeDerivatedData(a)
//   return a
// }
