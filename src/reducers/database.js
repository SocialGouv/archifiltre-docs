// @flow

import { Map } from 'immutable'
import { generateRandomString } from 'random-gen'
import duck from 'reducers/duck'

const type = 'cheapExp/database'

const key = Symbol()

function toCsvLine(val) {
  return `"${val.path.join('/')}","${val.size}"`
}

function fromCsvLine(csv_line) {
  let arr =
    csv_line.match(/(".*?")|([^,"\s]*)/g)
            .filter(a=>a!=="")
            .map(a=>a.replace(/"/g,''))
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
  if (parent.length > curr.length) {
    ans = false
  } else if (parent.length===curr.length) {
    ans = curr.map((val,i)=>val===parent[i])
      .reduce((acc,val)=>acc && val,true)
  } else {
    ans = curr.slice(0,parent.length-curr.length)
      .map((val,i)=>val===parent[i])
      .reduce((acc,val)=>acc && val,true)
  }
  return ans
}



function mkS(map,parent_path) {
  return {
    toCsv: () => map.reduce((acc,val) => {
      if (filterPath(parent_path, val.path)) {
        return acc + toCsvLine(val) + '\n'
      } else {
        return acc
      }
    },''),
    size: () => map.size,
    parent_path: () => parent_path.slice(),
    [key]: {
      map,
      parent_path
    }
  }
}

const initialState = mkS(Map(),[])

const { mkA, reducer } = duck(type, initialState)

export default reducer

export const create = mkA((path,size) => state =>
  mkS(state[key].map.set(mkId(), {
    path:path.split('/'),
    size
  }), state[key].parent_path)
)

export const fromCsv = mkA((csv) => state =>
  mkS(state[key].map.withMutations(map => 
    csv.split('\n').forEach(line => map.set(mkId(), fromCsvLine(line)))
  ), state[key].parent_path)
)

export const reInit = mkA(() => state => initialState)

export const setParentPath = mkA((parent_path) => state =>
  mkS(state[key].map, parent_path.slice())
)

const mkId = () => generateRandomString(40)
