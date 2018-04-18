// @flow

import { combineReducers } from 'redux'
import undoReducer from 'reducers/undo'

import database from 'reducers/database'
import database_alt from 'reducers/database-alt'
import appState from 'reducers/app-state'
import logError from 'reducers/log-error'
import icicleState from 'reducers/icicle-state'
import api from 'reducers/api'


export const { commit, undo, redo, reducer } = undoReducer(combineReducers({
  database_alt,
  database,
  appState,
  logError,
  icicleState,
  api
}))

export default reducer

export const selectAppState = state => state.appState
export const selectDatabase = state => state.database_alt
export const selectLogError = state => state.logError
export const selectIcicleState = state => state.icicleState
export const selectApi = state => state.api
