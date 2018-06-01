import { List } from 'immutable'

import * as File from 'file'

import * as FileSystem from 'file-system'
import * as Content from 'content'
const TT = FileSystem.TT

let content_queue
let tree

const initContentQueue = List
const initTree = () => TT.init(Content.create())
const init = () => {
  content_queue = initContentQueue()
  tree = initTree()
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
    case 'test':
      File.readAsArrayBuffer(e.data.file).then(a=>{
        // console.log('message')
      })
      break
    default:
  }
}

const pushHandler = (e) => {
  const queue_elem = FileSystem.makeQueueElem(e.data.path,e.data.content)
  content_queue = content_queue.push(queue_elem)
  tree = FileSystem.updateTreeWithQueueElem(queue_elem, tree)
}

const pullHandler = (e) => {
  postMessage({
    cmd:'pull',
    tree:TT.toJs(TT.sort(tree)),
    content_queue:FileSystem.contentQueueToJs(content_queue)
  })
  init()
}