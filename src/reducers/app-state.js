
import duck from 'reducers/duck'

const type = 'cheapExp/appState'

const key = Symbol()

const copyCurPath = s => s[key].cur_path.slice()

function mkS(
  start,
  finish,
  cur_path
) {
  return {
    isStarted: () => start,
    isFinished: () => finish,
    [key]: {
      cur_path
    }
  }
}

const initialState = mkS(false,false,[])

const { mkA, reducer } = duck(type, initialState)

export default reducer

export const startToLoadFiles = mkA(() => state => {
  console.time('loaded')
  return mkS(true,false,copyCurPath(state))
})
export const finishedToLoadFiles = mkA(() => state => {
  console.timeEnd('loaded')
  return mkS(true,true,copyCurPath(state))
})

export const reInit = mkA(() => state => initialState)
