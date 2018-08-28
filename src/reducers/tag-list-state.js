
import { Record } from 'immutable'
import * as RealEstate from 'reducers/real-estate'

const State = Record({
  tag_being_edited: '',
})

const property_name = 'tag_list_state'

const initialState = () => new State()

const reader = {
  tag_being_edited: () => state => state.get('tag_being_edited'),
}

const setTagBeingEdited = (tag) => state => {
  state = state.update('tag_being_edited',(a)=>tag)
  return state
}

const setNoTagBeingEdited = () => state => {
  state = state.update('tag_being_edited',(a)=>'')
  return state
}

const writer = {
  setTagBeingEdited,
  setNoTagBeingEdited,
}

export default RealEstate.create({
  property_name,
  initialState,
  reader,
  writer,
})
