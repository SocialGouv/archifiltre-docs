
import { Map } from 'immutable'
import { generateRandomString } from 'random-gen'
import duck from 'reducers/duck'

import { toCsvLine } from 'csv'


const type = 'cheapExp/log-error'

const key = Symbol()

function mkS(map) {
  return {
    toCsv: () => map.reduce((acc,val,key) =>
      acc + toCsvLine([key,val[0],val[1]])
    ,''),
    size: () => map.size,
    [key]: {
      map
    }
  }
}

const initialState = mkS(Map())

const { mkA, reducer } = duck(type, initialState)

export default reducer

export const logError = mkA((path, error) => state => {
  let map = state[key].map
  return mkS(map.set(map.size, [path, error]))
})

export const reInit = mkA(() => state => initialState)

