
import { generateRandomString } from 'random-gen'
import { Map, List, Record } from 'immutable'


const State = Record({
  content: undefined,
  pastC: List(),
  presentC: undefined,
  futureC: List()
})

const size_limit = 1000

export default function undoReducer(fRedux) {
  const rand = '_'+generateRandomString(40)
  const commit_type = 'commit'+rand
  const undo_type = 'undo'+rand
  const redo_type = 'redo'+rand


  function reducer(state = new State(), action) {
    if (action.type === commit_type) {
      return commitH(state)
    } else if (action.type === undo_type) {
      return undoH(state)
    } else if (action.type === redo_type) {
      return redoH(state)
    } else {
      return pass(state, action)
    }
  }

  const hasAPast = state => state.get('pastC').size !== 0
  const hasAFuture = state => state.get('futureC').size !== 0

  function commitH(state) {
    state = state.update('pastC', a=>a.push(state.get('presentC')))
    if (state.get('pastC').size > size_limit) {
      state = state.update('pastC', a=>a.slice(1))
    }
    state = state.set('presentC', state.get('content'))
    state = state.set('futureC', List())
    return state
  }

  function undoH(state) {
    if (hasAPast(state)) {
      state = state.update('futureC', a=>a.insert(0, state.get('presentC')))
      state = state.set('presentC', state.get('pastC').get(-1))
      state = state.update('pastC', a=>a.slice(0, -1))
      state = state.set('content', state.get('presentC'))
    }
    return state
  }

  function redoH(state) {
    if (hasAFuture(state)) {
      state = state.update('pastC', a=>a.push(state.get('presentC')))
      state = state.set('presentC', state.get('futureC').get(0))
      state = state.update('futureC', a=>a.slice(1))
      state = state.set('content', state.get('presentC'))
    }
    return state
  }

  function pass(state, action) {
    state = state.update('content', c => fRedux(c, action))
    if (!state.get('presentC')) {
      state = state.set('presentC', state.get('content'))
    }
    return state
  }

  const commit = () => {return {type:commit_type}}
  const undo = () => {return {type:undo_type}}
  const redo = () => {return {type:redo_type}}

  const selectContent = state => state.get('content')


  return { commit, undo, redo, reducer, hasAPast, hasAFuture, selectContent }
}