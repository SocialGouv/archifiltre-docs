
const Fs = require('fs')
const Path = require('path')

export const mkdir = (path) => {
  if (Fs.existsSync(path) === false) {
    mkdir(Path.dirname(path))
    Fs.mkdirSync(path)
  }
}
