

const Fs = require('fs')
const Path = require('path')


const recTraverseFileTree = (hook,path) => {
  const stats = Fs.statSync(path)
  if (stats.isDirectory()) {
    return Fs.readdirSync(path)
      .map(a=>recTraverseFileTree(hook,Path.join(path,a)))
      .reduce((acc,val)=>acc.concat(val),[])
  } else {
    hook()
    const file = {
      size:stats.size,
      lastModified:stats.mtimeMs,
    }
    return [[file,path]]
  }
}

const convertToPosixPath = (path) => path.split(Path.sep).join('/')

export const traverseFileTree = (hook,dropped_folder_path) => {
  let origin = recTraverseFileTree(hook,dropped_folder_path)
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








const recCopyFileTree = (hook,old_path,new_path) => {
  const stats = Fs.statSync(old_path)
  const mode = 0o555
  if (stats.isDirectory()) {
    Fs.mkdirSync(new_path)
    Fs.readdirSync(old_path)
      .map(a=>recCopyFileTree(hook,Path.join(old_path,a),Path.join(new_path,a)))
  } else {
    hook()
    Fs.copyFileSync(old_path,new_path)
  }
  // Fs.chmodSync(new_path, mode)
}

export const copyFileTree = (hook,dropped_folder_path) => {
  const new_path = dropped_folder_path+'copy'
  recCopyFileTree(hook,dropped_folder_path,new_path)
}






import JSZip from 'jszip'

const recZipFileTree = (hook,path,zip) => {
  const stats = Fs.statSync(path)
  if (stats.isDirectory()) {
    Fs.readdirSync(path)
      .map(a=>recZipFileTree(hook,Path.join(path,a),zip))
  } else {
    hook()

    const data = Fs.readFileSync(path)
    // console.log(path)
    zip.file(path, data)

    // zip.file(new_path,'tuaisetnausitenrsautienausiten')
  }
}

export const zipFileTree = (hook,dropped_folder_path) => {
  const zip = new JSZip()
  recZipFileTree(hook,dropped_folder_path,zip)
  return zip.generateAsync({type:'blob'})
}
