import { List } from 'immutable'


import * as FileUti from 'file-uti'

import * as FileSystem from 'file-system'
import * as Content from 'content'

let promise_array
let state

const init = () => {
  promise_array = []
  state = FileSystem.empty()
}

init()


onmessage = function(e) {
  switch (e.data.cmd) {
    case 'push':
      pushHandler(e)
      break
    case 'pull':
      pullHandler(e)
      break
    default:
  }
}

const pushHandler = (e) => {
  const promise = new Promise((resolve, reject) => {
    const parent_path = e.data.parent_path
    const file = e.data.file

    const path = parent_path + file.name
    const content = {
      size:file.size,
      last_modified:file.lastModified,
    }

    FileUti.readAsArrayBuffer(file).then(buffer=>{
      const view = new DataView(buffer)
      state = FileSystem.pushOnQueue(path, Content.create(content), state)
      resolve()
    })
  })

  promise_array.push(promise)
}

const pullHandler = (e) => {
  Promise.all(promise_array).then(() => {
    state = FileSystem.makeTree(state)
    state = FileSystem.sortBySize(state)
    state = FileSystem.computeDerivatedData(state)
    state = FileSystem.toJs(state)

    postMessage({
      cmd:'pull',
      state,
    })
    init()
  })
}



