// @flow

import { Map } from 'immutable'
import { generateRandomString } from 'random-gen'


const action_prefix = 'cheapExp/database/'+generateRandomString(40)+'/'

// Actions
const CREATE = action_prefix+'CREATE'
const UPDATE = action_prefix+'UPDATE'
const REMOVE = action_prefix+'REMOVE'


const initialState = Map()

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE:
      return state.set(generateRandomString(40), action.value)
    case UPDATE:
      return state.set(action.key, action.value)
    case REMOVE:
      return state.delete(action.key)
    default:
      return state
  }
}

// Action Creators
export function create(value) {
  return { type:CREATE, value }
}

export function update(key, value) {
  return { type:UPDATE, key, value }
}

export function remove(key) {
  return { type:REMOVE, key }
}

// Selectors
export function toCSV(state) {
  return state.database.reduce((acc,val) => acc + val + '\n','')
}

export function getSize(state) {
  return state.database.size
}
