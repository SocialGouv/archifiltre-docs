

const Fs = require('fs')
const Path = require('path')


const recTraverseFileTree = (path) => {
  const stats = Fs.statSync(path)
  if (stats.isDirectory()) {
    return Fs.readdirSync(path)
      .map(a=>recTraverseFileTree(Path.join(path,a)))
      .reduce((acc,val)=>acc.concat(val),[])
  } else {
    const file = {
      size:stats.size,
      lastModified:stats.mtimeMs,
    }
    return [[file,path]]
  }
}

const convertToPosixPath = (path) => path.split(Path.sep).join('/')

export const traverseFileTree = (dropped_folder_path) => {
  let origin = recTraverseFileTree(dropped_folder_path)
  dropped_folder_path = Path.dirname(dropped_folder_path)
  origin = origin.map(([file,path])=>[
    file,
    convertToPosixPath(path.slice(dropped_folder_path.length))
  ])
  return [dropped_folder_path,origin]
}


export function isJsonFile(path) {
  const stats = Fs.statSync(path)
  return stats.isFile() && Path.extname(path) === '.json'
}

export const readFileSync = Fs.readFileSync

