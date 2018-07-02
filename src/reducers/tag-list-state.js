
import duck from 'reducers/duck'
import { Record } from 'immutable'

const type = 'cheapExp/tagListState'


const State = Record({
  tag_being_edited: '',
})

function bundle(state) {
  return {
    tag_being_edited: () => state.get('tag_being_edited'),
  }
}

const initialState = new State()

const { mkA, reducer } = duck(type, initialState, bundle)

export default reducer


export const setTagBeingEdited = mkA((tag) => state =>{
  state = state.update('tag_being_edited',(a)=>tag)
  return state
})

export const setNoTagBeingEdited = mkA(() => state =>{
  state = state.update('tag_being_edited',(a)=>'')
  return state
})