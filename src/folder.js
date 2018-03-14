// import Worker from 'workers/file.worker.js'


export function asyncHandleDrop(event, insert2DB, loadCsv2DB) {
  // console.log(event)
  // let myWorker = new Worker()
  // myWorker.postMessage('obj',[
  //   // event,
  //   // event.dataTransfer,
  //   // event.dataTransfer.items[0],
  //   event.dataTransfer.items[0].webkitGetAsEntry(),
  // ])
  // myWorker.onmessage = function(e) {
  //   console.log(e)
  //   console.log('Message received from worker')
  // }



  event.preventDefault()
  let items = event.dataTransfer.items

  let promise_array = []
  for (let i=0; i<items.length; i++) {
    if (items[i].kind === 'file') {
      let entry = items[i].webkitGetAsEntry()
      if (isCsvFile(entry)) {
        promise_array.push(loadCsv(loadCsv2DB, entry))
      } else {
        promise_array.push(traverseFileTree(insert2DB, entry, ''))
      }
    }
  }
  return Promise.all(promise_array)
}

function isCsvFile(entry) {
  return entry.isFile && hasCsvExt(entry.name)
}

function hasCsvExt(s) {
  return s.split('.').slice(-1).pop() === 'csv'
}


function loadCsv(loadCsv2DB, entry) {
  return new Promise((resolve, reject) => {
    entry.file(file => {
      readFile(file).then(csv => {
        loadCsv2DB(csv)
        resolve()
      })
    }, e => console.log(e))
  })
}

export function readFile(file) {
  return new Promise((resolve, reject) => {
    let file_reader = new FileReader()
    file_reader.onload = e => {
      resolve(e.currentTarget.result)
    }
    file_reader.readAsText(file)
  })
  
}


function traverseFileTree(insert2DB, entry, path) {
  if (entry.isFile) {
    return traverseFile(insert2DB, entry, path)
  } else if (entry.isDirectory) {
    return traverseFolder(insert2DB, entry, path)
  }
}

function traverseFile(insert2DB, entry, path) {
  return new Promise((resolve, reject) => {
    entry.file(file => {
      insert2DB(path + file.name+','+file.size)
      resolve()
    }, e => console.log(e))
  })
}

function traverseFolder(insert2DB, entry, path) {
  return new Promise((resolve, reject) => {
    let promise_array = []
    let dirReader = entry.createReader()
    const doBatch = () => {
      dirReader.readEntries(entries => {
        if (entries.length > 0) {
          entries.forEach(e =>
            promise_array.push(traverseFileTree(insert2DB, e, path+entry.name+"/"))
          )
          doBatch()
        } else {
          Promise.all(promise_array).then(()=>resolve())
        }
      }, e => console.log(e))
    }
    doBatch()
  })
}
