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


function mkS(map) {
  return {
    toCsv: () => map.reduce((acc,val) => acc + toCsvLine(val) + '\n',''),
    size: () => map.size,
    [key]: {
      map
    }
  }
}

const initialState = mkS(Map())

const { mkA, reducer } = duck(type, initialState)

export default reducer

export const create = mkA((path,size) => state =>
  mkS(state[key].map.set(mkId(), {
    path:path.split('/'),
    size
  }))
)

export const fromCsv = mkA((csv) => state =>
  mkS(state[key].map.withMutations(map => 
    csv.split('\n').forEach(line => map.set(mkId(), fromCsvLine(line)))
  ))
)

export const reInit = mkA(() => state => initialState)


const mkId = () => generateRandomString(40)
