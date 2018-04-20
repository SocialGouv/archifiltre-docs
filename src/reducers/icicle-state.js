
import duck from 'reducers/duck'

const type = 'cheapExp/icicleState'

const key = Symbol()

function mkS(
  id_arr
) {
  return {
    hover_sequence: () => id_arr,
    [key]: {}
  }
}

const noFocusState = mkS([-1])
const initialState = noFocusState


const { mkA, reducer } = duck(type, initialState)

export default reducer

export const setFocus = mkA((id_arr) => state => {
  return mkS(id_arr)
})

export const setNoFocus = mkA(() => state => {
  return noFocusState
})