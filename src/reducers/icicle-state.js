
import duck from 'reducers/duck'
import { Record, Set } from 'immutable'

const type = 'cheapExp/icicleState'


const State = Record({
  hover_seq:[],
  lock_seq:[],
  dims: {},
  tag_to_highlight: '',
  display_root:[],
  change_skin:false,
})

function bundle(state) {
  return {
    hover_sequence: () => state.get('hover_seq'),
    lock_sequence: () => state.get('lock_seq'),
    hover_dims: () => state.get('dims'),
    tag_to_highlight: () => state.get('tag_to_highlight'),
    display_root: () => state.get('display_root'),
    isFocused: () => state.get('hover_seq').length > 0,
    isLocked: () => state.get('lock_seq').length > 0,
    isZoomed: () => state.get('display_root').length > 0,
    changeSkin: () => state.get('change_skin')
  }
}

const initialState = new State()


const { mkA, reducer } = duck(type, initialState, bundle)

export default reducer

export const setFocus = mkA((id_arr, dims, isLocked) => state => {
  state = state.update('hover_seq',()=>id_arr)
  if(!isLocked) state = state.update('dims',()=>dims)
  return state
})

export const setNoFocus = mkA(() => state => {
  state = state.update('hover_seq', () => [])
  state = state.update('dims',()=>{return {}})
  return state
})

export const lock = mkA((id_arr, dims) => state => {
  state = state.update('lock_seq',()=>id_arr)
  state = state.update('dims',()=>dims)
  return state
})

export const unlock = mkA(() => state => {
  state = state.update('lock_seq', () => [])
  return state
})

export const setDisplayRoot = mkA((root_seq) => state =>{
  state = state.update('display_root',()=>root_seq)
  state = state.update('lock_seq', () => [])
  clearSelection()
  return state
})

export const setNoDisplayRoot = mkA(() => state =>{
  state = state.update('display_root',()=>[])
  state = state.update('lock_seq', () => [])
  clearSelection()
  return state
})

export const setTagToHighlight = mkA((tag) => state =>{
  state = state.update('tag_to_highlight',()=>tag)
  return state
})

export const setNoTagToHighlight = mkA(() => state =>{
  state = state.update('tag_to_highlight',()=>'')
  return state
})

const clearSelection = () => {
  if (window.getSelection) {
    window.getSelection().removeAllRanges()
  } else if (document.selection) {
    document.selection.empty()
  }
}

export const toggleChangeSkin = mkA(() => state =>{
  state = state.update('change_skin',a=>!a)
  return state
})