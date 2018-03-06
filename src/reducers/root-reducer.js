import { combineReducers } from 'redux'

import database from 'reducers/database'
import appState from 'reducers/app-state'


const reducer = combineReducers({
  database,
  appState
})
 
export default reducer