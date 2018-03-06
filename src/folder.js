

// export function handleDrop(event) {
//   event.preventDefault()
//   let items = event.dataTransfer.items

//   let state = makeState()

//   for (let i=0; i<items.length; i++) {
//     paraTraverseFileTree(state, items[i].webkitGetAsEntry(), '')
//   }
// }


// function makeState() {
//   let csv = ''
//   let count = 0

//   return {
//     addLine2Csv : function(path, size) {
//       csv += path + ',' + size + '\n'
//       console.log(csv)
//     },
//     countPlusPlus : function() {
//       count++
//       console.log(count)
//     },
//     getCsv : function() {
//       return csv
//     }
//   }
// }

// function paraTraverseFileTree(state, item, path) {
//   if (item.isFile) {
//     item.file(f => handleFile(state, f, path))
//   } else if (item.isDirectory) {
//     let dirReader = item.createReader()
//     dirReader.readEntries(entries => {
//       for (let i=0; i<entries.length; i++) {
//         paraTraverseFileTree(state, entries[i], path + item.name + "/")
//       }
//     })
//   }
// }

// function handleFile(state, file, path) {
//   // state.addLine2Csv(path + file.name, file.size)
//   state.countPlusPlus()
// }




export function asyncHandleDrop(event, insert2DB) {
  event.preventDefault()
  let items = event.dataTransfer.items
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

