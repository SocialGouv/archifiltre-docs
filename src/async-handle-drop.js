
import AsyncHandleDropWorker from 'async-handle-drop.worker'
import * as VirtualFileSystem from 'datastore/virtual-file-system'

export default (dropped_folder_path) => {
  return new Promise((resolve, reject) => {
    const worker = new AsyncHandleDropWorker()
    worker.onmessage = (e) => {
      const vfs = VirtualFileSystem.fromJs(e.data.vfs)
      worker.terminate()
      resolve(vfs)
    }
    worker.postMessage({
      dropped_folder_path,
    })
  })
}