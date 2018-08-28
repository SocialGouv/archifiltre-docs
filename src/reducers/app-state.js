
import { Record } from 'immutable'
import * as RealEstate from 'reducers/real-estate'

const State = Record({
  start:false,
  finish:false,
})

const property_name = 'app_state'

const initialState = () => new State()

const reader = {
  isStarted: () => state => state.get('start'),
  isFinished: () => state => state.get('finish'),
}

const startToLoadFiles = () => state => {
  console.time('loaded')
  state = state.update('start', () => true) 
  state = state.update('finish', () => false) 
  return state
}

const finishedToLoadFiles = () => state => {
  console.timeEnd('loaded')
  state = state.update('start', () => true) 
  state = state.update('finish', () => true) 
  return state
}

const reInit = () => state => initialState()

const writer = {
  startToLoadFiles,
  finishedToLoadFiles,
  reInit,
}

export default RealEstate.create({
  property_name,
  initialState,
  reader,
  writer,
})
