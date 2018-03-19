
import { generateRandomString } from 'random-gen'


export default function duckReducer(type, initialState) {
  type = type+'_'+generateRandomString(40)
  const mkA = f => function(...args) {
    return {type,f:f(...args)}
  }

  function reducer(state = initialState, action) {
    if (action.type === type) {
      return action.f(state)
    } else {
      return state
    }
  }

  return { mkA, reducer }
}
