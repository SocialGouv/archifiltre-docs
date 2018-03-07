// @flow

import { combineReducers } from 'redux'

import database from 'reducers/database'
import appState from 'reducers/app-state'

const reducer = combineReducers({
  database,
  appState
})
 
export default reducer

export function selectAppState(state) {
  return state.appState
}

export function selectDatabase(state) {
  return state.database
}

