// @flow

import { combineReducers } from 'redux'

import database from 'reducers/database'
import appState from 'reducers/app-state'
import logError from 'reducers/log-error'

const reducer = combineReducers({
  database,
  appState,
  logError
})
 
export default reducer

export const selectAppState = state => state.appState
export const selectDatabase = state => state.database
export const selectLogError = state => state.logError
