// @flow

import { combineReducers } from 'redux'

import database from 'reducers/database'
import database_alt from 'reducers/database-alt'
import appState from 'reducers/app-state'
import logError from 'reducers/log-error'
import icicleState from 'reducers/icicle-state'

const reducer = combineReducers({
  database_alt,
  appState,
  logError,
  icicleState
})
 
export default reducer

export const selectAppState = state => state.appState
export const selectDatabase = state => state.database_alt
export const selectLogError = state => state.logError
export const selectIcicleState = state => state.icicleState
