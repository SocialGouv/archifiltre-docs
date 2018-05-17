

import duck from 'reducers/duck'
import * as FileSystem from 'file-system'

const type = 'cheapExp/database'


function bundle(state) {
  return {
    size: () => FileSystem.size(state),
    max_depth: () => FileSystem.depth(state),
    parent_path: () => FileSystem.parentPath(state),
    getByID: (id) => FileSystem.getByID(id, state),
    getIDPath: (id) => FileSystem.getIDPath(id, state),
    volume: () => FileSystem.volume(state),
    root_id: () => FileSystem.rootId(state),
    toJson: () => FileSystem.toJson(state),
    toStrList2: () => FileSystem.toStrList2(state),
    getSessionName: () => FileSystem.getSessionName(state)
  }
}

const initialState = FileSystem.empty()

const { mkA, reducer } = duck(type, initialState, bundle)


export default reducer

export const push = mkA((path, content) => state => {
  return FileSystem.pushOnQueue(path, content, state)
})

export const makeTree = mkA(() => state => {
  return FileSystem.makeTree(state)
})

export const sort = mkA(() => state => {
  return FileSystem.sort(state)
})

export const fromJson = mkA((json) => state => {
  return FileSystem.fromJson(json)
})

export const fromLegacyCsv = mkA((csv) => state => {
  return FileSystem.fromLegacyCsv(csv)
})


export const reInit = mkA(() => state => initialState)

export const setParentPath = mkA((parent_path) => state => {
  return FileSystem.setParentPath(parent_path, state)
})

export const setContentByID = mkA((id, content) => state => {
  const updater = (entry) => entry.set('content', content)
  state = FileSystem.updateByID(id, updater, state)
  return state
})

export const setSessionName = mkA((name) => state => {
  state = FileSystem.setSessionName(name,state)
  return state
})