
import duck from 'reducers/duck'
import { Record } from 'immutable'

const type = 'cheapExp/icicleState'


const State = Record({
  editing_tags:false,
})

function bundle(state) {
  return {
    editing_tags: () => state.get('editing_tags'),
  }
}

const initialState = new State()

const { mkA, reducer } = duck(type, initialState, bundle)

export default reducer


export const toggleEditingTags = mkA(() => state =>{
  state = state.update('editing_tags',(a)=>!a)
  return state
})

export const startEditingTags = mkA(() => state =>{
  state = state.update('editing_tags',(a)=>true)
  return state
})

export const stopEditingTags = mkA(() => state =>{
  state = state.update('editing_tags',(a)=>false)
  return state
})