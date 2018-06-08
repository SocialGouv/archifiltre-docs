

import duck from 'reducers/duck'

import { request } from 'request'

import * as Base64 from 'base64'


import { selectApi } from 'reducers/root-reducer'
import { Record } from 'immutable'

const type = 'cheapExp/api'


const State = Record({
  account_name:'',
  password:'',
  token:'',
  retry:0
})

function bundle(state) {
  return {
    getToken: () => state.get('token'),
  }
}

const initialState = new State()

const { mkA, reducer, key } = duck(type, initialState, bundle)

export default reducer

export const reInit = mkA(() => state => initialState)


const setCredential = mkA((account_name,password) => state => {
  state = state.update('account_name', () => account_name)
  state = state.update('password', () => password)
  return state
})

const setToken = mkA((token) => state => {
  state = state.update('token', () => token)
  state = state.update('retry', () => 1)
  return state
})


export const signUp = (account_name,password) => (dispatch, getState) => {
  return request({
    method:'POST',
    url:'http://localhost:3000/basic/account',
    headers:{
      Authorization:'Basic '+Base64.fromUtf8(account_name+':'+password)
    }
  })
  .then(() => dispatch(signIn(account_name,password)))
}

export const signIn = (account_name,password) => (dispatch, getState) => {
  dispatch(setCredential(account_name,password))
  return dispatch(getToken())
}

const getToken = () => (dispatch, getState) => {
  const state = selectApi(getState())
  console.log(state[key])
  return request({
    method:'GET',
    url:'http://localhost:3000/basic/account',
    headers:{
      Authorization:'Basic '+Base64.fromUtf8(state[key].account_name+':'+state[key].password)
    }
  })
  .then(res => {
    res = JSON.parse(res)
    return dispatch(setToken(res.token))
  })
}
