

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



// window.thug = Object.assign({},window.thug,{
//   reInit,
//   signUp,
//   signIn
// })














// const ref = {
//   token:null,
//   retry:0,
//   account_name:'',
//   password:''
// }


// const retry = f => {
//   if (ref.retry > 0) {
//     ref.retry -= 1
//     return getToken().then(f)
//   }
// }


// // SOME DUMMY TEST


// const checkToken = () => {
//   return request({
//     method:'GET',
//     url:'http://localhost:3000/bearer',
//     headers:{
//       Authorization:'Bearer '+ref.token
//     }
//   })
//   .catch(() => retry(() => checkToken()))
// }


// const createFs = (root) => {
//   return request({
//     method:'POST',
//     url:'http://localhost:3000/bearer/fs/'+root,
//     headers:{
//       Authorization:'Bearer '+ref.token
//     }
//   })
// }


// const readFs = (root) => {
//   return request({
//     method:'GET',
//     url:'http://localhost:3000/bearer/fs/'+root,
//     headers:{
//       Authorization:'Bearer '+ref.token
//     }
//   })
// }

// const pushFs = (root,path) => {
//   return request({
//     method:'POST',
//     url:'http://localhost:3000/bearer/fs/'+root+path,
//     headers:{
//       Authorization:'Bearer '+ref.token
//     }
//   })
// }




// const makeBigBody = (num) => {
//   let arr = []
//   for (let i = num - 1; i >= 0; i--) {
//     arr.push(Math.floor(Math.random() * 9))
//   }
//   return arr.join('')
// }


// const sendBigFile = (body) => {
//   return getToken('fufu','pass')
//     .then(() => console.time('sendBigFile'))
//     .then(() => request({
//       method:'GET',
//       url:'http://localhost:3000/bearer',
//       headers:{
//         Authorization:'Bearer '+ref.token
//       },
//       body
//     }))
//     .then(() => console.timeEnd('sendBigFile'))
// }





// const makeArr = (num) => {
//   let arr = []
//   for (let i = 0; i < num; i++) {
//     let str = ''
//     for (let j = 0; j < 1+Math.floor(Math.random() * 8); j++) {
//       str += '/'+Math.floor(Math.random() * 10)
//     }
//     arr.push(str)
//   }
//   return arr
// }


// const paraDoAction = (arr) => {
//   const roo = Math.floor(Math.random() * 2000000)
//   return getToken('fufu','pass')
//     .then(() => createFs(roo))
//     .then(() => Promise.all(arr.map(e => pushFs(roo,e))))
//     .then(() => readFs(roo))
//     .then(a => console.log(a))
// }


// const seqDoAction = (arr) => {
//   const roo = Math.floor(Math.random() * 2000000)
//   let pro = getToken('fufu','pass')
//     .then(() => createFs(roo))
//     .then(() => console.time('seqDoAction'))
//   arr.forEach(e => {
//     pro = pro.then(() => pushFs(roo,e))
//   })

//   pro.then(() => console.timeEnd('seqDoAction'))
//     .then(() => readFs(roo))
//     .then(a => console.log(JSON.parse(a)))
// }


// const testDebugLog = () => {
//   return request({
//     method:'GET',
//     url:'http://localhost:3000/basic/',
//   })
// }
