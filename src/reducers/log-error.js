
import { Map } from 'immutable'
import { generateRandomString } from 'random-gen'
import duck from 'reducers/duck'

import { toCsvLine } from 'csv'
import { Record } from 'immutable'


const type = 'cheapExp/log-error'


const State = Record({
  map:Map(),
})


function mkS(state) {
  const map = state.get('map')
  return {
    toCsv: () => map.reduce((acc,val,key) =>
      acc + toCsvLine([key,val[0],val[1]])
    ,''),
    size: () => map.size,
  }
}

const initialState = new State()

const { mkA, reducer } = duck(type, initialState, mkS)

export default reducer

export const logError = mkA((path, error) => state => {
  state = state.update('map', a=>a.set(a.size, [path, error]))
  return state
})

export const reInit = mkA(() => state => initialState)
