
import { combineReducers } from 'redux'
import undoReducer from 'reducers/undo'

import database from 'reducers/database'
import appState from 'reducers/app-state'
import icicleState from 'reducers/icicle-state'
import api from 'reducers/api'


const combine = undoReducer(combineReducers({
  database,
  appState,
  icicleState,
  api
}))

const reducer = combine.reducer

export default reducer

export const commit = combine.commit
export const undo = combine.undo
export const redo = combine.redo
export const hasAPast = combine.hasAPast
export const hasAFuture = combine.hasAFuture


export const selectAppState = state => combine.selectContent(state).appState
export const selectDatabase = state => combine.selectContent(state).database
export const selectIcicleState = state => combine.selectContent(state).icicleState
export const selectApi = state => combine.selectContent(state).api
