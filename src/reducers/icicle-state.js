
import duck from 'reducers/duck'
import { Record } from 'immutable'

const type = 'cheapExp/icicleState'


const State = Record({
  id_arr:[-1],
  dims:{}
})

function bundle(state) {
  return {
    hover_sequence: () => state.get('id_arr'),
    hover_dims: () => state.get('dims'),
    isFocused: () => !(state.get('id_arr').includes(-1))
  }
}

const noFocusState = new State()
const initialState = noFocusState


const { mkA, reducer } = duck(type, initialState, bundle)

export default reducer

export const setFocus = mkA((id_arr, dims) => state => {
  state = state.update('id_arr',()=>id_arr)
  state = state.update('dims',()=>dims)
  return state
})

export const setNoFocus = mkA(() => state => {
  return noFocusState
})