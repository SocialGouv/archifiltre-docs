
import { traverseFileTree, isJsonFile, readFileSync } from 'traverse-file-tree'

import * as VirtualFileSystem from 'datastore/virtual-file-system'

onmessage = function(e) {
  const data = e.data
  const dropped_folder_path = data.dropped_folder_path

  if (isJsonFile(dropped_folder_path)) {
    const content = readFileSync(dropped_folder_path,'utf8')
    const content_without_byte_order_mark = content.slice(1)
    
    postMessage({
      vfs:JSON.parse(content_without_byte_order_mark),
    })
  } else {
    const [path,origin] = traverseFileTree(dropped_folder_path)

    let vfs = VirtualFileSystem.make(origin)
    vfs = VirtualFileSystem.derivate(vfs)

    postMessage({
      vfs:VirtualFileSystem.toJs(vfs),
    })
  }
}
