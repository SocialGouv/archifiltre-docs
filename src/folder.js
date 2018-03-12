

export function asyncHandleDrop(event, insert2DB, loadCsv2DB) {
  let myWorker = new Worker('worker.js')

  event.preventDefault()
  let items = event.dataTransfer.items
  if (areCsvFiles(items)) {
    return handleCsvFiles(loadCsv2DB, items)
  } else {
    return handleFolders(insert2DB, items)
  }
}

function areCsvFiles(items) {
  let ans = []
  for (let i=0; i<items.length; i++) {
    let item = items[i].webkitGetAsEntry()
    ans.push(item.isFile && hasCsvExt(item.name))
  }
  return ans.reduce((acc,val) => acc && val,true)
}

function hasCsvExt(s) {
  return s.split('.').slice(-1).pop() === 'csv'
}



function handleCsvFiles(loadCsv2DB, items) {
  let promise_array = []
  for (let i=0; i<items.length; i++) {
    promise_array.push(loadCsv(loadCsv2DB, items[i].webkitGetAsEntry()))
  }
  return Promise.all(promise_array)
}

function loadCsv(loadCsv2DB, item) {
  return new Promise((resolve, reject) => {
    item.file(file => {
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


function handleFolders(insert2DB, items) {
  let promise_array = []
  for (let i=0; i<items.length; i++) {
    promise_array.push(traverseFileTree(insert2DB, items[i].webkitGetAsEntry(), ''))
  }
  return Promise.all(promise_array)
}



function traverseFileTree(insert2DB, item, path) {
  if (item.isFile) {
    return traverseFile(insert2DB, item, path)
  } else if (item.isDirectory) {
    return traverseFolder(insert2DB, item, path)
  }
}

function traverseFile(insert2DB, item, path) {
  return new Promise((resolve, reject) => {
    item.file(file => {
      insert2DB(path + file.name+','+file.size)
      resolve()
    }, e => console.log(e))
  })
}

function traverseFolder(insert2DB, item, path) {
  return new Promise((resolve, reject) => {
    let promise_array = []
    let dirReader = item.createReader()
    const doBatch = () => {
      dirReader.readEntries(entries => {
        if (entries.length > 0) {
          entries.forEach(e =>
            promise_array.push(traverseFileTree(insert2DB, e, path+item.name+"/"))
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

