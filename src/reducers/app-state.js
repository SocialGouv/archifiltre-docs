
import duck from 'reducers/duck'
import { Record } from 'immutable'

const type = 'cheapExp/appState'


const State = Record({
  start:false,
  finish:false,
})


function bundle(state) {
  return {
    isStarted: () => state.get('start'),
    isFinished: () => state.get('finish')
  }
}

const initialState = new State()

const { mkA, reducer } = duck(type, initialState, bundle)

export default reducer

export const startToLoadFiles = mkA(() => state => {
  console.time('loaded')
  state = state.update('start', () => true) 
  state = state.update('finish', () => false) 
  return state
})
export const finishedToLoadFiles = mkA(() => state => {
  console.timeEnd('loaded')
  state = state.update('start', () => true) 
  state = state.update('finish', () => true) 
  return state
})

export const reInit = mkA(() => state => initialState)
