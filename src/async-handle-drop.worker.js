

import { traverseFileTree, isJsonFile, readFileSync } from 'traverse-file-tree'

import * as VirtualFileSystem from 'datastore/virtual-file-system'
import { fromAnyJsonToJs } from 'compatibility'



onmessage = function(e) {
  const data = e.data
  const dropped_folder_path = data.dropped_folder_path
  let count = 0
  const thres = 1000
  let last_ms = 0

  if (isJsonFile(dropped_folder_path)) {
    postMessage({status:'loading'})
    const content = readFileSync(dropped_folder_path,'utf8')
    const content_without_byte_order_mark = content.slice(1)
    
    let vfs = VirtualFileSystem.fromJs(fromAnyJsonToJs(content_without_byte_order_mark))

    postMessage({status:'derivate'})
    vfs = VirtualFileSystem.derivate(vfs)

    postMessage({
      status:'return',
      vfs:VirtualFileSystem.toJs(vfs),
    })
  } else {
    const traverseHook = () => {
      count++
      let cur_ms = (new Date()).getTime()
      if (cur_ms - last_ms >= thres) {
        postMessage({status:'traverse',count})
      }
      last_ms = cur_ms
    }

    postMessage({status:'traverse',count})
    const [path,origin] = traverseFileTree(traverseHook,dropped_folder_path)
    postMessage({status:'traverse',count})


    postMessage({status:'make'})
    let vfs = VirtualFileSystem.make(origin)
    postMessage({status:'derivate'})
    vfs = VirtualFileSystem.derivate(vfs)

    postMessage({
      status:'return',
      vfs:VirtualFileSystem.toJs(vfs),
    })
  }
}
