
import * as Loop from 'test/loop'

import * as V5 from '../version/v5/src/file-system'
import * as V6 from '../version/v6/src/file-system'
import * as V7 from '../version/v7/src/file-system'


export const fromAnyJsonToJs = (fromJsonToJs,json) => {
  const version = JSON.parse(json).version

  let js

  switch (version) {
    case 5:
      if (js===undefined) {
        js = V5.toJs(V5.fromJson(json))
      }
      js = v5JsToV6Js(js)
    case 6:
      if (js===undefined) {
        js = V6.toJs(V6.fromJson(json))
      }
      js = v6JsToV7Js(js)
    case 7:
      if (js===undefined) {
        js = V7.toJs(V7.fromJson(json))
      }
      js = v7JsToV8Js(js)
    case 8:
      if (js===undefined) {
        js = fromJsonToJs(json)
      }
  }
  return js
}


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
    a.version = 6
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


    const addTag = (id) => (tag) => {
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
      entry.content.tags.forEach(addTag(id))

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






export const v6JsToV7Js = (v6) => {
  const v7 = Object.assign({},v6)
  v7.version = 7
  return v7
}



export const v7JsToV8Js = (v7) => {
  const v8 = Object.assign({},v7)
  v8.version = 8
  v8.tags_sizes = {}

  const table = v8.tree.table


  const sortBySize = (ids) => {
    const compare = (a,b) => {
      const s_a = table[a].content.size
      const s_b = table[b].content.size
      if (s_a > s_b) {
        return -1
      } else if (s_a === s_b) {
        return 0
      } else {
        return 1
      }
    }
    const sizes = ids.sort(compare)
    return sizes
  }

  const filterChildren = (ids) => {
    const getAllChildren = (id) => {
      const children = table[id].children
      return children.concat(children.map(getAllChildren).reduce((acc,val)=>acc.concat(val),[]))
    }

    if (ids.length <= 1) {
      return ids
    } else {
      const head_id = ids[0]
      const children_head_id = getAllChildren(head_id)

      const tail = ids.slice(1)
      const filtered_tail = tail.filter(a=>children_head_id.includes(a)===false)
      return [head_id].concat(filterChildren(filtered_tail))
    }
  }

  const reduceToSize = (ids) => {
    return ids.reduce((acc,val)=>acc+table[val].content.size,0)
  }
  
  for (let key in table) {
    delete table[key].content.tags
  }

  for (let key in v8.content_queue) {
    delete v8.content_queue[key].content.tags
  }

  for (let key in v8.tags) {
    v8.tags_sizes[key] = reduceToSize(filterChildren(sortBySize(v8.tags[key])))
  }

  return v8
}

