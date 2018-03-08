// @flow

import { Map } from 'immutable'
import { generateRandomString } from 'random-gen'
import duck from 'reducers/duck'

const type = 'cheapExp/database'

const key = Symbol()

function mkS(map) {
  return {
    toCSV: () => map.reduce((acc,val) => acc + val + '\n',''),
    size: () => map.size,
    [key]: {
      map
    }
  }
}

const initialState = mkS(Map())

const { mkA, reducer } = duck(type, initialState)

export default reducer

export const create = mkA((value) => state =>
  mkS(state[key].map.set(mkId(), value))
)

export const update = mkA((key, value) => state =>
  mkS(state[key].map.set(key, value))
)

export const remove = mkA((key) => state =>
  mkS(state[key].map.delete(key))
)

export const fromCSV = mkA((csv) => state =>
  mkS(Map().withMutations(map => 
    csv.split('\n').forEach(line => map.set(mkId(), line))
  ))
)


const mkId = () => generateRandomString(40)
