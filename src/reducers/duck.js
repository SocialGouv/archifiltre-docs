
import { generateRandomString } from 'random-gen'

export default function duckReducer(type, initial_state, initial_bundler) {
  type = type+'_'+generateRandomString(40)

  const key = Symbol()
  const unbundler = state => state[key]
  const bundler = state => {
    const ans = initial_bundler(state)
    ans[key] = state
    return ans
  } 
  initial_state = bundler(initial_state)

  const mkA = f => function(...args) {
    return {type,f:f(...args)}
  }

  function reducer(state = initial_state, action) {
    if (action.type === type) {
      return bundler(action.f(unbundler(state)))
    } else {
      return state
    }
  }

  return { mkA, reducer, key }
}



// export default function duckReducer(type, initialState) {
//   type = type+'_'+generateRandomString(40)
//   const mkA = f => function(...args) {
//     return {type,f:f(...args)}
//   }

//   function reducer(state = initialState, action) {
//     if (action.type === type) {
//       return action.f(state)
//     } else {
//       return state
//     }
//   }

//   return { mkA, reducer }
// }
