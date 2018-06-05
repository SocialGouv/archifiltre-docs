

import duck from 'reducers/duck'
import * as Content from 'content'
import * as FileSystem from 'file-system'



import Worker from 'file-system.worker'



const type = 'cheapExp/database'


function bundle(state) {
  return {
    size: () => FileSystem.size(state),
    maxDepth: () => FileSystem.depth(state),
    parent_path: () => FileSystem.parentPath(state),
    getByID: (id) => FileSystem.getByID(id, state),
    getIDPath: (id) => FileSystem.getIDPath(id, state),
    volume: () => FileSystem.volume(state),
    rootId: () => FileSystem.rootId(state),
    toJson: () => FileSystem.toJson(state),
    toStrList2: () => FileSystem.toStrList2(state),
    getSessionName: () => FileSystem.getSessionName(state),
    getLeafIdArray: () => FileSystem.getLeafIdArray(state)
  }
}

const initialState = FileSystem.empty()

const { mkA, reducer } = duck(type, initialState, bundle)


export default reducer


export const push = mkA((parent_path, file) => state => {
  const path = parent_path + file.name
  const content = {
    size:file.size,
    last_modified:file.lastModified,
  }
  return FileSystem.pushOnQueue(path, Content.create(content), state)
})

export const makeTree = mkA(() => state => {
  state = FileSystem.makeTree(state)
  state = FileSystem.sortBySize(state)
  state = FileSystem.computeDerivatedData(state)
  return state
})

export const sortByMaxRemainingPathLength = mkA(() => state => {
  state = FileSystem.sortByMaxRemainingPathLength(state)

  return state
})

const worker = new Worker()


export const workerPush = mkA((parent_path, file) => state => {
  const path = parent_path + file.name
  const content = {
    size:file.size,
    last_modified:file.lastModified,
  }
  worker.postMessage({
    cmd:'push',
    path,
    content
  })
  return state
})

const workerGhostFromJs = mkA((content_queue_js,tree_js) => state => {
  state = FileSystem.ghostQueueFromJs(content_queue_js,state)
  state = FileSystem.ghostTreeFromJs(tree_js,state)
  state = FileSystem.computeDerivatedData(state)
  return state
})

export const workerMakeTree = () => dispatch => {
  return new Promise((resolve, reject) => {
    worker.postMessage({
      cmd:'pull'
    })

    worker.onmessage = (e) => {
      if (e.data.cmd === 'pull') {
        dispatch(workerGhostFromJs(e.data.content_queue,e.data.tree))
        resolve()
      }
    }
  })
}



export const fromJson = mkA((json) => state => {
  return FileSystem.fromJson(json)
})

export const fromLegacyCsv = mkA((csv) => state => {
  state = FileSystem.fromLegacyCsv(csv)
  state = FileSystem.makeTree(state)
  state = FileSystem.sortBySize(state)
  state = FileSystem.computeDerivatedData(state)
  return state
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