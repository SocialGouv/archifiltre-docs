
import { Record } from 'immutable'
import { generateRandomString } from 'random-gen'


const action_prefix = 'cheapExp/appState/'+generateRandomString(40)+'/'

// Actions
const START_TO_LOAD_FILES = action_prefix+'START_TO_LOAD_FILES'
const FINISHED_TO_LOAD_FILES = action_prefix+'FINISHED_TO_LOAD_FILES'

const obj = {
  start_to_load_files: false,
  finished_to_load_files: false
}
const initialState = new (Record(obj))(obj)



// function makeState() {
//   let start_to_load_files = false,
//   finished_to_load_files: false

//   return {
//     addLine2Csv : function(path, size) {
//       csv += path + ',' + size + '\n'
//       console.log(csv)
//     },
//     getCsv : function() {
//       return csv
//     }
//   }
// }


// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case START_TO_LOAD_FILES:
      console.time('loaded')
      return state.set('start_to_load_files',true)
    case FINISHED_TO_LOAD_FILES:
      console.timeEnd('loaded')
      return state.set('finished_to_load_files',true)
    default:
      return state
  }
}

// Action Creators
export function startToLoadFiles() {
  return { type:START_TO_LOAD_FILES }
}

export function finishedToLoadFiles() {
  return { type:FINISHED_TO_LOAD_FILES }
}


// Selectors
export function isStarted(state) {
  return state.appState.get('start_to_load_files')
}

export function isFinished(state) {
  return state.appState.get('finished_to_load_files')
}
