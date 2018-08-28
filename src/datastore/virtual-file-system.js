
import * as RecordUtil from 'util/record-util'
import * as FilesAndFolders from 'datastore/files-and-folders'
import * as Tags from 'datastore/tags'

const virtualFileSystem = RecordUtil.createFactory({
  session_name:'Untitled',
  version:9,
  files_and_folders:FilesAndFolders.empty(),
  tags:Tags.empty(),
},{
  toJs: a => {
    a.files_and_folders = FilesAndFolders.toJs(a.files_and_folders)
    a.tags = Tags.toJs(a.tags)
    return a
  },
  fromJs: a => {
    a.files_and_folders = FilesAndFolders.fromJs(a.files_and_folders)
    a.tags = Tags.fromJs(a.tags)
    return a
  },
})

export const make = origin => virtualFileSystem({
  files_and_folders:FilesAndFolders.ff(origin),
})

export const derivateTags = vfs =>
  vfs.update('tags', tags => Tags.update(vfs.get('files_and_folders'), tags))

export const derivateFilesAndFolders = vfs =>
  vfs.update('files_and_folders', FilesAndFolders.computeDerived)

export const derivate = vfs =>
  derivateTags(derivateFilesAndFolders(vfs))

export const toJs = virtualFileSystem.toJs
export const fromJs = virtualFileSystem.fromJs

