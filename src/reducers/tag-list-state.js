
import { Record } from 'immutable'
import * as RealEstate from 'reducers/real-estate'

const State = Record({
  tag_id_being_edited: '',
})

const property_name = 'tag_list_state'

const initialState = () => new State()

const reader = {
  tagIdBeingEdited: () => state => state.get('tag_id_being_edited'),
}

const setTagIdBeingEdited = (tag) => state => {
  state = state.update('tag_id_being_edited',(a)=>tag)
  return state
}

const setNoTagIdBeingEdited = () => state => {
  state = state.update('tag_id_being_edited',(a)=>'')
  return state
}

const reInit = () => state => initialState()

const writer = {
  setTagIdBeingEdited,
  setNoTagIdBeingEdited,
  reInit,
}

export default RealEstate.create({
  property_name,
  initialState,
  reader,
  writer,
})
