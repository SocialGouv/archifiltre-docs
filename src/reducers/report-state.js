
import duck from 'reducers/duck'
import { Record } from 'immutable'

const type = 'cheapExp/icicleState'


const State = Record({
  editing_tags:false,
  editing_comments:false,
  candidate_comments:''
})

function bundle(state) {
  return {
    editing_tags: () => state.get('editing_tags'),
    editing_comments: () => state.get('editing_comments'),
    candidate_comments: () => state.get('candidate_comments'),
  }
}

const initialState = new State()

const { mkA, reducer } = duck(type, initialState, bundle)

export default reducer


export const startEditingTags = mkA(() => state =>{
  state = state.update('editing_tags',(a)=>true)
  return state
})

export const stopEditingTags = mkA(() => state =>{
  state = state.update('editing_tags',(a)=>false)
  return state
})

export const startEditingComments = mkA(() => state =>{
  state = state.update('editing_comments',(a)=>true)
  return state
})

export const stopEditingComments = mkA(() => state =>{
  state = state.update('editing_comments',(a)=>false)
  state = state.set('candidate_comments','')
  return state
})

export const setCandidateComments = mkA((comments) => state =>{
  state = state.set('candidate_comments',comments)
  return state
})