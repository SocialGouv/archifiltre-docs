
import { Record, Set } from 'immutable'
import * as RealEstate from 'reducers/real-estate'

const State = Record({
  hover_seq:[],
  lock_seq:[],
  dims: {},
  tag_to_highlight: '',
  display_root:[],
  change_skin:false,
})

const property_name = 'icicle_state'

const initialState = () => new State()

const reader = {
  hover_sequence: () => state => state.get('hover_seq'),
  lock_sequence: () => state => state.get('lock_seq'),
  hover_dims: () => state => state.get('dims'),
  tag_to_highlight: () => state => state.get('tag_to_highlight'),
  display_root: () => state => state.get('display_root'),
  isFocused: () => state => state.get('hover_seq').length > 0,
  isLocked: () => state => state.get('lock_seq').length > 0,
  isZoomed: () => state => state.get('display_root').length > 0,
  changeSkin: () => state => state.get('change_skin'),
}

const setFocus = (id_arr, dims, isLocked) => state => {
  state = state.update('hover_seq',()=>id_arr)
  if(!isLocked) state = state.update('dims',()=>dims)
  return state
}

const setNoFocus = () => state => {
  state = state.update('hover_seq', () => [])
  state = state.update('dims',()=>{return {}})
  return state
}

const lock = (id_arr, dims) => state => {
  state = state.update('lock_seq',()=>id_arr)
  state = state.update('dims',()=>dims)
  return state
}

const unlock = () => state => {
  state = state.update('lock_seq', () => [])
  return state
}

const setDisplayRoot = (root_seq) => state => {
  state = state.update('display_root',()=>root_seq)
  state = state.update('lock_seq', () => [])
  clearSelection()
  return state
}

const setNoDisplayRoot = () => state => {
  state = state.update('display_root',()=>[])
  state = state.update('lock_seq', () => [])
  clearSelection()
  return state
}

const clearSelection = () => {
  if (window.getSelection) {
    window.getSelection().removeAllRanges()
  } else if (document.selection) {
    document.selection.empty()
  }
}

const setTagToHighlight = (tag) => state => {
  state = state.update('tag_to_highlight',()=>tag)
  return state
}

const setNoTagToHighlight = () => state => {
  state = state.update('tag_to_highlight',()=>'')
  return state
}

const toggleChangeSkin = () => state => {
  state = state.update('change_skin',a=>!a)
  return state
}

const writer = {
  setFocus,
  setNoFocus,
  lock,
  unlock,
  setDisplayRoot,
  setNoDisplayRoot,
  setTagToHighlight,
  setNoTagToHighlight,
  toggleChangeSkin,
}

export default RealEstate.create({
  property_name,
  initialState,
  reader,
  writer,
})


