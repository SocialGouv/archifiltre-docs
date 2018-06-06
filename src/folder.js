
import { mkScheduler } from 'scheduler'
import * as FileUti from 'file-uti'

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
      FileUti.readAsText(file).then(content => {
        resolve(content)
      })
    }, e => {
      console.log(e)
      resolve()
    })
  })
}


function traverseFileTree(insert2DB, entry, parent_path) {
  if (entry.isFile) {
    return traverseFile(insert2DB, entry, parent_path)
  } else if (entry.isDirectory) {
    return traverseFolder(insert2DB, entry, parent_path)
  }
}


// import Worker from 'file-system.worker'
// const worker = new Worker()


function traverseFile(insert2DB, entry, parent_path) {
  return new Promise((resolve, reject) => sch.schedule(() => {
    entry.file(file => {
      // insert2DB(
      //   parent_path + file.name,
      //   {
      //     size:file.size,
      //     last_modified:file.lastModified,
      //     error_is_file:null
      //   }
      // )
      insert2DB(parent_path, file)
      resolve()
      // worker.postMessage({
      //   cmd:'test',
      //   file
      // })
    }, e => {
      // insert2DB(
      //   parent_path + entry.name,
      //   {
      //     error_is_file:true
      //   }
      // )
      insert2DB(parent_path, new File([''], entry.name))
      resolve()
    })
  }))
}

function traverseFolder(insert2DB, entry, parent_path) {
  return new Promise((resolve, reject) => sch.schedule(() => {
    let promise_array = []
    let dirReader = entry.createReader()
    const doBatch = () => {
      dirReader.readEntries(entries => {
        if (entries.length > 0) {
          entries.forEach(e =>
            promise_array.push(traverseFileTree(insert2DB, e, parent_path+entry.name+'/'))
          )
          doBatch()
        } else {
          Promise.all(promise_array).then(()=>resolve())
        }
      }, e => {
        // insert2DB(
        //   parent_path + entry.name,
        //   {
        //     error_is_file:false
        //   }
        // )
        insert2DB(parent_path, new File([''], entry.name+'/'))
        resolve()
      })
    }
    doBatch()
  }))
}


