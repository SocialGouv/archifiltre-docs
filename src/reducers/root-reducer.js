// @flow

import { combineReducers } from 'redux'

import database from 'reducers/database-alt'
import database_alt from 'reducers/database-alt'
import appState from 'reducers/app-state'
import logError from 'reducers/log-error'

const reducer = combineReducers({
  database_alt,
  appState,
  logError
})
 
export default reducer

export const selectAppState = state => state.appState
export const selectDatabase = state => state.database_alt
export const selectLogError = state => state.logError
