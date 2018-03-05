
import * as Folder from 'folder'

window.onload = function () {
  let dropzone = document.getElementById('dropzone')

  dropzone.ondragover = e => e.preventDefault()
  dropzone.ondrop = Folder.handleDrop
}

