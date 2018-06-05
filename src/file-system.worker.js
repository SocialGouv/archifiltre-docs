import { List } from 'immutable'

import * as FileUti from 'file-uti'

import * as FileSystem from 'file-system'
import * as Content from 'content'
const TT = FileSystem.TT

let content_queue
let tree
let promise_array

const initContentQueue = List
const initTree = () => TT.init(Content.create())
const init = () => {
  content_queue = initContentQueue()
  tree = initTree()
  promise_array = []
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
    // case 'test':
    //   FileUti.readAsArrayBuffer(e.data.file).then(a=>{
    //     // console.log('message')
    //   })
    //   break
    default:
  }
}

const pushHandler = (e) => {
  const promise = new Promise((resolve, reject) => {
    const queue_elem = FileSystem.makeQueueElem(e.data.path,Content.create(e.data.content))
    content_queue = content_queue.push(queue_elem)
    tree = FileSystem.updateTreeWithQueueElem(queue_elem, tree)
    resolve()
  })

  promise_array.push(promise)
}

const pullHandler = (e) => {
  Promise.all(promise_array).then(() => {
    postMessage({
      cmd:'pull',
      tree:TT.toJs(TT.sort(Content.compareSize)(tree)),
      content_queue:FileSystem.contentQueueToJs(content_queue)
    })
    init()
  })
}



