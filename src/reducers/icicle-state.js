
import duck from 'reducers/duck'
import { Record } from 'immutable'

const type = 'cheapExp/icicleState'


const State = Record({
  hover_seq:[-1],
  dims: {},
  display_root:[-1]
})

function bundle(state) {
  return {
    hover_sequence: () => state.get('hover_seq'),
    hover_dims: () => state.get('dims'),
    isFocused: () => !(state.get('hover_seq').includes(-1)),
    display_root: () => state.get('display_root'),
    isZoomed: () => !(state.get('display_root').includes(-1))
  }
}

const initialState = new State()


const { mkA, reducer } = duck(type, initialState, bundle)

export default reducer

export const setFocus = mkA((id_arr, dims) => state => {
  state = state.update('hover_seq',()=>id_arr)
  state = state.update('dims',()=>dims)
  return state
})

export const setNoFocus = mkA(() => state => {
  state = state.update('hover_seq', () => [-1])
  state = state.update('dims',()=>{})
  return state
})

export const setDisplayRoot = mkA((root_seq) => state =>{
  state = state.update('display_root',()=>root_seq)
  return state
})

export const setNoDisplayRoot = mkA(() => state =>{
  state = state.update('display_root',()=>[-1])
  return state
})