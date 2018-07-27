import * as Arbitrary from 'test/arbitrary'
import * as Loop from 'test/loop'

import * as ArrayUtil from 'util/array-util'
import * as ListUtil from 'util/list-util'
import * as RecordUtil from 'util/record-util'

import * as ObjectUtil from 'util/object-util'

import { List, Map, Set } from 'immutable'



const arbitraryMockFile = () => {
  return {
    size:Arbitrary.natural(),
    lastModified:Arbitrary.natural(),
  }
}

const arbitraryPath = () => {
  const index = () => Arbitrary.index()+1
  const value = () => Math.floor(Math.random()*5)
  return '/'+Arbitrary.arrayWithIndex(index)(value).join('/')
}

export const arbitraryOrigin = () => {
  const index = () => Arbitrary.index()+1
  const a = Arbitrary.arrayWithIndex(index)(() => {
    return [arbitraryMockFile(), arbitraryPath()]
  })

  const compare = (a,b) => {
    if (a.length < b.length) {
      return a === b.slice(0,a.length)
    } else {
      return b === a.slice(0,b.length)
    }
  }

  return a.reduce((acc,val) => {
    const shouldAdd = acc.reduce((bool,val2) => bool && !compare(val2[1], val[1]), true)
    if (shouldAdd) {
      return acc.concat([val])
    } else {
      return acc
    }
  }, [])
}

export const sortOrigin = a => a.sort((a,b)=>{
  a = a[1]
  b = b[1]
  if (a < b) {
    return -1
  } else if (a === b) {
    return 0
  } else {
    return 1
  }
})
















const v_folder = RecordUtil.createFactory({
  name:'',
  alias:'',
  comments:'',
  children:List(),
},{
  toJs: a => {
    a.children = a.children.toArray()
    return a
  },
  fromJs: a => {
    a.children = List(a.children)
    return a
  },
})




const v_file = RecordUtil.createFactory({
  file_size:0,
  file_last_modified:0,
},{
  toJs: a => a,
  fromJs: a => a,
})



export const ffs = a => {
  const mapper = ([file,path]) => {
    const names = path.split('/')
    const ids = names.map((name,i)=>names.slice(0,i+1).join('/'))
    const childrens = ids.slice(1).map(a=>List.of(a)).concat([List()])
    let m = Map()

    const loop = ArrayUtil.zip([names,ids,childrens])
    loop.forEach(([name,id,children])=>{
      m = m.set(id,v_folder({
        name,
        children,
      }))
    })

    ids.slice(-1).forEach(id=>{
      m = m.update(id,a=>{
        return RecordUtil.compose(v_file({
          file_size:file.size,
          file_last_modified:file.lastModified,
        }),a)
      })
    })
    return m
  }

  return a.map(mapper).reduce((acc,val)=>mergeFfs(val,acc), emptyFfs())
}

const emptyFfs = ()=>Map({
  '':v_folder(),
})

const mergeFfs = (a,b) => {
  const merger = (oldVal, newVal) => {
    oldVal = oldVal.update('children',b =>
      b.concat(newVal.get('children').filter(a=>b.includes(a)===false))
    )
    return oldVal
  }
  return b.mergeWith(merger, a)
}

const reduceFfs = (reducer,m) => {
  const rec = (id) => {
    const node = m.get(id)
    const children_ans_array = node.get('children').toArray().map(rec)
    const [ans,next_node] = reducer([children_ans_array,node])
    m = m.set(id,next_node)
    return ans
  }

  return [rec(''),m]
}

const diveFfs = (diver,first_ans,m) => {
  const rec = (parent_ans,id) => {
    const node = m.get(id)
    const [ans,next_node] = diver([parent_ans,node])
    m = m.set(id,next_node)
    node.get('children').forEach(id=>rec(ans,id))
  }
  rec(first_ans,'')

  return m
}

export const ffsInv = m => {
  const reducer = ([children_ans_array,node]) => {
    if (children_ans_array.length === 0) {
      const file = {
        size:node.get('file_size'),
        lastModified:node.get('file_last_modified'),
      }
      const path = node.get('name')
      const ans = [[file, path]]
      return [ans,node]
    } else {
      children_ans_array = ArrayUtil.join(children_ans_array)
      const ans = children_ans_array.map(a=>{
        const path = node.get('name') + '/' + a[1]
        return [a[0], path]
      })

      return [ans, node]
    }
  }
  const [ans,_] = reduceFfs(reducer,m)
  return ans
}


















const v_derived = RecordUtil.createFactory({
  size:0,
  last_modified_max:0,
  last_modified_list:List(),
  last_modified_min:Number.MAX_SAFE_INTEGER,
  last_modified_median:null,
  last_modified_average:null,
  depth:0,
  nb_files:0,
  sort_by_size_index:List(),
  sort_by_date_index:List(),
},{
  toJs: a => {
    a.last_modified_list = a.last_modified_list.toArray()
    a.sort_by_size_index = a.sort_by_size_index.toArray()
    a.sort_by_date_index = a.sort_by_date_index.toArray()
    return a
  },
  fromJs: a => {
    a.last_modified_list = List(a.last_modified_list)
    a.sort_by_size_index = List(a.sort_by_size_index)
    a.sort_by_date_index = List(a.sort_by_date_index)
    return a
  },
})


const mergeDerived = (a,b) => {
  b = b.update('size',b=>b+a.get('size'))
  b = b.update('last_modified_list',b=>b.concat(a.get('last_modified_list')))
  b = b.update('nb_files',b=>b+a.get('nb_files'))
  return b
}

const afterMergeDerived = a => {
  const list = a.get('last_modified_list')
  a = a.set('last_modified_max',list.max())
  a = a.set('last_modified_min',list.min())
  a = a.set('last_modified_median',ListUtil.median(list))
  a = a.set('last_modified_average',ListUtil.average(list))
  return a
}

const sortChildren = (children_ans_array,a) => {
  const children_ans = List(children_ans_array)
  a = a.set(
    'sort_by_size_index',
    ListUtil.indexSort(a=>a.get('size'),children_ans).reverse()
  )
  a = a.set(
    'sort_by_date_index',
    ListUtil.indexSort(a=>a.get('last_modified_average'),children_ans)
  )
  return a
}

export const computeDerived = m => {
  m = m.map(a => {
    if (a.has('file_size')) {
      return RecordUtil.composeFactory(v_file, v_folder)(a)
    } else {
      return v_folder(a)
    }
  })

  const reducer = ([children_ans_array,node]) => {
    let ans
    if (children_ans_array.length === 0) {
      const flm = node.get('file_last_modified')
      const size = node.get('file_size')
      ans = v_derived({
        size,
        last_modified_max:flm,
        last_modified_list:List.of(flm),
        last_modified_min:flm,
        last_modified_median:flm,
        last_modified_average:flm,
        nb_files:1,
      })
    } else {
      ans = children_ans_array.reduce((acc,val)=>mergeDerived(val,acc))
      ans = afterMergeDerived(ans)
      ans = sortChildren(children_ans_array,ans)
    }
    node = RecordUtil.compose(ans,node)
    return [ans, node]
  }
  let [_,next_m] = reduceFfs(reducer,m)

  const diver = ([parent_ans,node]) => {
    node = node.set('depth', parent_ans)
    parent_ans = parent_ans + 1
    return [parent_ans,node]
  }
  next_m = diveFfs(diver,0,next_m)

  return next_m
}













const toAndFromJs = (file,folder) => [
  a => {
    a = a.map(a => {
      if (a.has('file_size')) {
        return file.toJs(a)
      } else {
        return folder.toJs(a)
      }
    })
    a = a.toObject()
    return a
  },
  a => {
    a = Map(a)
    a = a.map(a => {
      if (a.hasOwnProperty('file_size')) {
        return file.fromJs(a)
      } else {
        return folder.fromJs(a)
      }
    })
    return a
  }
]

export const [toSaveJs,fromSaveJs] = toAndFromJs(
  RecordUtil.composeFactory(v_file, v_folder),
  v_folder
)

export const [toFullJs,fromFullJs] = toAndFromJs(
  RecordUtil.composeFactory(
    v_derived,
    RecordUtil.composeFactory(v_file, v_folder)
  ),
  RecordUtil.composeFactory(v_derived, v_folder)
)

