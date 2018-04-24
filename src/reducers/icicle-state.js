
import duck from 'reducers/duck'
import { Record } from 'immutable'

const type = 'cheapExp/icicleState'


const State = Record({
  id_arr:[-1],
})

function bundle(state) {
  return {
    hover_sequence: () => state.get('id_arr'),
  }
}

const noFocusState = new State()
const initialState = noFocusState


const { mkA, reducer } = duck(type, initialState, bundle)

export default reducer

export const setFocus = mkA((id_arr) => state => {
  state = state.update('id_arr',()=>id_arr)
  return state
})

export const setNoFocus = mkA(() => state => {
  return noFocusState
})