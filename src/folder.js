

export function handleDrop(event) {
  event.preventDefault()
  let items = event.dataTransfer.items

  let state = makeState()
  console.time()
  for (let i=0; i<items.length; i++) {
    // serialTraverseFileTree(items[i].webkitGetAsEntry(), [() => console.timeEnd()])
    paraTraverseFileTree(state, items[i].webkitGetAsEntry(), '')
  }
}

function makeState() {
  let csv = ''

  return {
    addLine2Csv : function(path, size) {
      csv += path + ',' + size + '\n'
      // console.log(csv)
    },
    getCsv : function() {
      return csv
    }
  }
}

function paraTraverseFileTree(state, item, path) {
  if (item.isFile) {
    item.file(f => handleFile(state, f, path))
  } else if (item.isDirectory) {
    let dirReader = item.createReader()
    dirReader.readEntries(entries => {
      for (let i=0; i<entries.length; i++) {
        paraTraverseFileTree(state, entries[i], path + item.name + "/")
      }
    })
  }
}

function handleFile(state, file, path) {
  console.log(file.name)
  state.addLine2Csv(path + file.name, file.size)
}






// SERIAL

function serialTraverseFileTree(item, callbacks) {
  if (item.isFile) {
    traverseFile(item, callbacks)
  } else if (item.isDirectory) {
    traverseFolder(item, callbacks)
  }
}


function traverseFile(item, callbacks) {
  item.file(f => {
    // console.log(f.name)
    callbacks[0](callbacks.slice(1))
  })
}

function traverseFolder(item, callbacks) {
  let dirReader = item.createReader()
  dirReader.readEntries(entries => {
    if (entries.length > 0) {
      let inner_callbacks = entries.map(e => cs => serialTraverseFileTree(e,cs))
      inner_callbacks[0](inner_callbacks.slice(1).concat(callbacks))
    } else {
      callbacks[0](callbacks.slice(1))
    }
  })
}
