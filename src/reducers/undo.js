
import { generateRandomString } from 'random-gen'


export default function undoReducer(fRedux) {
  const rand = '_'+generateRandomString(40)
  const commit_type = 'commit'+rand
  const undo_type = 'undo'+rand
  const redo_type = 'redo'+rand

  const size_limit = 1000

  let pastC = []
  let presentC
  let futureC = []

  function reducer(state, action) {
    if (action.type === commit_type) {
      return commitH(state)
    } else if (action.type === undo_type) {
      return undoH(state)
    } else if (action.type === redo_type) {
      return redoH(state)
    } else {
      const ans = fRedux(state, action)
      if (!presentC) {
        presentC = ans
      }
      return ans
    }
  }


  function commitH(state) {
    if (presentC) {
      pastC.push(presentC)
      if (pastC.length > size_limit) {
        pastC = pastC.slice(1)
      }
    }
    presentC = state
    futureC = []
    return state
  }

  function undoH(state) {
    if (presentC) {
      if (pastC.slice(-1)[0]) {
        futureC = [presentC].concat(futureC)
        presentC = pastC.pop()
      }
      return presentC
    } else {
      return state
    }
  }

  function redoH(state) {
    if (presentC) {
      if (futureC[0]) {
        pastC.push(presentC)
        presentC = futureC[0]
        futureC = futureC.slice(1)
      }
      return presentC
    } else {
      return state
    }
  }

  const commit = () => {return {type:commit_type}}
  const undo = () => {return {type:undo_type}}
  const redo = () => {return {type:redo_type}}

  return { commit, undo, redo, reducer }
}