
import version from 'version'

import * as ObjectUtil from 'util/object-util'
import * as RecordUtil from 'util/record-util'
import * as FilesAndFolders from 'datastore/files-and-folders'
import * as Tags from 'datastore/tags'

if (isNaN(version) || typeof version !== 'number') {
  throw new Error('version is not a number')
}

const virtualFileSystem = RecordUtil.createFactory({
  session_name:'Untitled',
  version,
  files_and_folders:FilesAndFolders.empty(),
  tags:Tags.empty(),
},{
  toJs: a => ObjectUtil.compose({
    files_and_folders:FilesAndFolders.toJs(a.files_and_folders),
    tags:Tags.toJs(a.tags),
  },a),
  fromJs: a => ObjectUtil.compose({
    files_and_folders:FilesAndFolders.fromJs(a.files_and_folders),
    tags:Tags.fromJs(a.tags),
  }),
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

