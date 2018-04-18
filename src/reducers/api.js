

import duck from 'reducers/duck'

import { request, b64Toutf8, utf8Tob64 } from 'request'
import { selectApi } from 'reducers/root-reducer'

const type = 'cheapExp/api'

const key = Symbol()

function mkS(
  account_name='',
  password='',
  token='',
  retry=0
) {
  return {
    getToken: () => token,
    [key]: {
      account_name,
      password
    }
  }
}

const initialState = mkS()

const { mkA, reducer } = duck(type, initialState)

export default reducer

export const reInit = mkA(() => state => initialState)


const setCredential = mkA((account_name,password) => state => {
  return mkS(account_name,password,'',0)
})

const setToken = mkA((token) => state => {
  return mkS(
    state[key].account_name,
    state[key].password,
    token,
    1
  )
})


export const signUp = (account_name,password) => (dispatch, getState) => {
  return request({
    method:'POST',
    url:'http://localhost:3000/basic/account',
    headers:{
      Authorization:'Basic '+utf8Tob64(account_name+':'+password)
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
      Authorization:'Basic '+utf8Tob64(state[key].account_name+':'+state[key].password)
    }
  })
  .then(res => {
    res = JSON.parse(res)
    return dispatch(setToken(res.token))
  })
}
