
import { Map } from 'immutable'
import { generateRandomString } from 'random-gen'
import duck from 'reducers/duck'

import { toCsvLine, fromCsvLine } from 'csv'

import * as TT from 'table-tree'
import { List, Record } from 'immutable'

const type = 'cheapExp/database'


function csvLineToVal(csv_line) {
  let arr = fromCsvLine(csv_line)
  if (arr.length === 2) {
    return {
      path:arr[0].split('/'),
      size:arr[1]
    }
  } else {
    return {
      path:arr.slice(0,-1).join('').split('/'),
      size:arr.slice(-1)
    }
  }
}

function filterPath(parent,curr) {
  let ans
  if (parent.size > curr.size) {
    ans = false
  } else if (parent.size===curr.size) {
    ans = curr.map((val,i)=>val===parent.get(i))
      .reduce((acc,val)=>acc && val,true)
  } else {
    // ans = curr.slice(0,parent.size-curr.size)
    ans = curr.slice(0,parent.size)
      .map((val,i)=>val===parent.get(i))
      .reduce((acc,val)=>acc && val,true)
  }
  return ans
}


const State = Record({
  tree:null,
  root_id:'',
  parent_path:List(),
  nb_update:0,
  max_depth:0
})


function mkS(state) {
  return {
    toCsv: () =>
      TT.toCsvList(state.get('tree'))
        .filter(val=>filterPath(state.get('parent_path'), val.get(0)))
        .map(val=>toCsvLine([val.get(0).join('/'),val.get(1)]))
        .join('')
    ,
    toCsvNoFilter: () =>
      TT.toCsvList(state.get('tree'))
        .map(val=>toCsvLine([val.get(0).join('/'),val.get(1)]))
        .join('')
    ,
    size: () => state.get('nb_update'),
    max_depth: () => state.get('max_depth'),
    parent_path: () => state.get('parent_path').toArray(),
    getByID: (id) => state.get('tree').get(id).toJS(),
    getIDList: () => TT.getIdList(state.get('tree')),
    getRootIDs: () => TT.getRootIdArray(state.get('tree'))
  }
}

const tree = TT.init('root')
const root_id = TT.getRootIdArray(tree)[0]
const initialState = new State({tree,root_id})


const { mkA, reducer } = duck(type, initialState, mkS)

export default reducer

export const create = mkA((path,size) => state => {
  path = path.split('/')
  state = state.update('tree', tree => 
    TT.update(path, size, state.get('root_id'),tree))

  state = state.update('nb_update', a=>a+1)
  state = state.update('max_depth', a=>Math.max(a, path.length))
  return state
})

export const fromCsv = mkA((csv) => state => {
  state = state.update('tree', tree => {
    csv.split('\n').forEach(line => {
      const {path,size} = csvLineToVal(line)
      tree = TT.update(path, size, state.get('root_id'),tree)
    })
    return tree
  })
  return state
})

export const reInit = mkA(() => state => initialState)

export const setParentPath = mkA((parent_path) => state =>
  state.set('parent_path', List(parent_path))
)
