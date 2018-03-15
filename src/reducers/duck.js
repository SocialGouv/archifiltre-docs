
export default function duckReducer(type, initialState) {
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
