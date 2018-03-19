
import duck from 'reducers/duck'

const type = 'cheapExp/appState'

const key = Symbol()

const copyCurPath = s => s[key].cur_path.slice()

function mkS(
  start,
  finish
) {
  return {
    isStarted: () => start,
    isFinished: () => finish,
    [key]: {}
  }
}

const initialState = mkS(false,false)

const { mkA, reducer } = duck(type, initialState)

export default reducer

export const startToLoadFiles = mkA(() => state => {
  console.time('loaded')
  return mkS(true,false)
})
export const finishedToLoadFiles = mkA(() => state => {
  console.timeEnd('loaded')
  return mkS(true,true)
})

export const reInit = mkA(() => state => initialState)
