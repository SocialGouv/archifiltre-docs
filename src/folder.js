
import { mkScheduler } from 'scheduler'

const sch = mkScheduler()

export function asyncHandleDrop(event, insert2DB, loadJson2DB, loadLegacyCsv2DB) {
  event.preventDefault()
  const items = event.dataTransfer.items

  const entry = items[0].webkitGetAsEntry()
  if (isJsonFile(entry)) {
    return readFileFromEntry(entry)
      .then(loadJson2DB)
      .then(()=>false)
  } else if (isLegacyCsvFile(entry)) {
    return readFileFromEntry(entry)
      .then(loadLegacyCsv2DB)
      .then(()=>false)
  } else {
    const promise_array = []
    for (let i=0; i<items.length; i++) {
      const entry = items[i].webkitGetAsEntry()
      promise_array.push(traverseFileTree(insert2DB, entry, ''))
    }
    return Promise.all(promise_array)
      .then(()=>true)
  }
}

function isJsonFile(entry) {
  return entry.isFile && hasJsonExt(entry.name)
}

function hasJsonExt(s) {
  return s.split('.').slice(-1).pop() === 'json'
}

function isLegacyCsvFile(entry) {
  return entry.isFile && hasLegacyCsvExt(entry.name)
}

function hasLegacyCsvExt(s) {
  return s.split('.').slice(-1).pop() === 'csv'
}


function readFileFromEntry(entry) {
  return new Promise((resolve, reject) => {
    entry.file(file => {
      readFile(file).then(content => {
        resolve(content)
      })
    }, e => {
      console.log(e)
      resolve()
    })
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
  return new Promise((resolve, reject) => sch.schedule(() => {
    entry.file(file => {
      insert2DB(
        path + file.name,
        {
          size:file.size,
          last_modified:file.lastModified,
          error_is_file:null
        }
      )
      resolve()
    }, e => {
      insert2DB(
        path + entry.name,
        {
          error_is_file:true
        }
      )
      resolve()
    })
  }))
}

function traverseFolder(insert2DB, entry, path) {
  return new Promise((resolve, reject) => sch.schedule(() => {
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
      }, e => {
        insert2DB(
          path + entry.name,
          {
            error_is_file:false
          }
        )
        resolve()
      })
    }
    doBatch()
  }))
}


