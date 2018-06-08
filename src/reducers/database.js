

import duck from 'reducers/duck'
import * as Content from 'content'
import * as FileSystem from 'file-system'



import Worker from 'file-system.worker'



const type = 'cheapExp/database'


function bundle(state) {
  return {
    size_overall: () => FileSystem.size_overall(state),
    size_files: () => FileSystem.size_files(state),

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

    getTagged: (tag) => FileSystem.getTagged(state, tag),
    getAllTags: () => FileSystem.getAllTags(state),

    getLeafIdArray: () => FileSystem.getLeafIdArray(state),
    getSubIdList: (id) => FileSystem.getSubIdList(id, state),

    getWaitingCounter: () => waiting_counter,
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
const workerOnMessageHandler = {}

worker.onmessage = (e) => {
  const data = e.data
  const cmd = data.cmd
  workerOnMessageHandler[cmd](data)
}

let waiting_counter = 0
workerOnMessageHandler.pushCounter = ({push_counter}) => {
  waiting_counter = push_counter
}


export const workerPush = mkA((parent_path, file) => state => {
  worker.postMessage({
    cmd:'push',
    parent_path,
    file
  })
  return state
})

const workerSetStateFromJs = mkA((js) => () => FileSystem.fromJs(js))

export const workerMakeTree = () => dispatch => {
  return new Promise((resolve, reject) => {
    worker.postMessage({
      cmd:'pull'
    })

    workerOnMessageHandler.pull = ({state}) => {
      dispatch(workerSetStateFromJs(state))
      resolve()
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

export const addTagged = mkA((tag, id) => state => {
  state = FileSystem.addTagged(state, tag, id)
  return state
})

export const deleteTagged = mkA((tag, id) => state => {
  state = FileSystem.deleteTagged(state, tag, id)
  return state
})