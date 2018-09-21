
import { Record } from 'immutable'
import * as RealEstate from 'reducers/real-estate'

const State = Record({
  editing_tags:false,
})

const property_name = 'report_state'

const initialState = () => new State()

const reader = {
  editing_tags: () => state => state.get('editing_tags'),
}

const startEditingTags = () => state => {
  state = state.update('editing_tags',(a)=>true)
  return state
}

const stopEditingTags = () => state => {
  state = state.update('editing_tags',(a)=>false)
  return state
}

const reInit = () => state => initialState()

const writer = {
  startEditingTags,
  stopEditingTags,
  reInit,
}

export default RealEstate.create({
  property_name,
  initialState,
  reader,
  writer,
})
