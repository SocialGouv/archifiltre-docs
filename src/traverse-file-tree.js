

const fs = require('fs')

const recTraverseFileTree = (path) => {
  const stats = fs.statSync(path)
  if (stats.isDirectory()) {
    return fs.readdirSync(path)
      .map(a=>recTraverseFileTree(path+'/'+a))
      .reduce((acc,val)=>acc.concat(val),[])
  } else {
    const file = {
      size:stats.size,
      lastModified:stats.mtimeMs,
    }
    return [[file,path]]
  }
}

const cdDotDot = path => path.split('/').slice(0,-1).join('/')


export const traverseFileTree = (dropped_folder_path) => {
  let origin = recTraverseFileTree(dropped_folder_path)
  dropped_folder_path = cdDotDot(dropped_folder_path)
  origin = origin.map(([file,path])=>[file,path.slice(dropped_folder_path.length)])
  return [dropped_folder_path,origin]
}


export function isJsonFile(path) {
  const stats = fs.statSync(path)
  return stats.isFile() && hasJsonExt(path)
}

function hasJsonExt(path) {
  const name = path.split('/').slice(-1)[0].split('.')
  if (name.length===2) {
    return name.slice(-1).pop() === 'json'
  } else {
    return false
  }
}

export const readFileSync = fs.readFileSync

