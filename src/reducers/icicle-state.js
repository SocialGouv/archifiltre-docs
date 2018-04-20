
import duck from 'reducers/duck'

const type = 'cheapExp/icicleState'

const key = Symbol()

function mkS(
  id_arr
) {
  return {
    hover_sequence: () => id_arr
  }
}

const initialState = mkS(-1)

const { mkA, reducer } = duck(type, initialState)

export default reducer

export const handleMouseOver = mkA((id_arr) => state => {
  return mkS(id_arr)
})