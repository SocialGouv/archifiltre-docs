
import AsyncHandleDropWorker from 'async-handle-drop.worker'
import * as VirtualFileSystem from 'datastore/virtual-file-system'

export default (hook,dropped_folder_path) => {
  return new Promise((resolve, reject) => {
    const worker = new AsyncHandleDropWorker()
    worker.onmessage = (e) => {
      if (e.data.status === 'return') {
        const vfs = VirtualFileSystem.fromJs(e.data.vfs)
        worker.terminate()
        resolve(vfs)
      } else {
        hook(e.data)
      }
    }
    worker.postMessage({
      dropped_folder_path,
    })
  })
}