

import duck from 'reducers/duck'
import * as FileSystem from 'file-system'

const type = 'cheapExp/database'


function bundle(state) {
  return {
    size: () => FileSystem.size(state),
    max_depth: () => FileSystem.depth(state),
    parent_path: () => FileSystem.parentPath(state),
    getByID: (id) => FileSystem.getByID(id, state),
    volume: () => FileSystem.volume(state),
    root_id: () => FileSystem.rootId(state),
    toJson: () => FileSystem.toJson(state),
    toStrList2: () => FileSystem.toStrList2(state)
  }
}

const initialState = FileSystem.empty()

const { mkA, reducer } = duck(type, initialState, bundle)


export default reducer

export const push = mkA((path, content) => state => {
  return FileSystem.pushOnQueue(path, content, state)
})

export const makeTree = mkA(() => state => {
  return FileSystem.makeTree(state)
})

export const sort = mkA(() => state => {
  return FileSystem.sort(state)
})

export const fromJson = mkA((json) => state => {
  return FileSystem.fromJson(json)
})

export const fromLegacyCsv = mkA((csv) => state => {
  return FileSystem.fromLegacyCsv(csv)
})


export const reInit = mkA(() => state => initialState)

export const setParentPath = mkA((parent_path) => state => {
  return FileSystem.setParentPath(parent_path, state)
})



// function bundle(state) {
//   return {
//     toCsv: () =>
//       TT.toStrList2(state.get('tree'))
//         .filter(val=>filterPath(state.get('parent_path'), val.get(0)))
//         .map(val=>toCsvLine([val.get(0).join('/'),val.get(1)]))
//         .join('')
//     ,
//     toCsvNoFilter: () =>
//       TT.toStrList2(state.get('tree'))
//         .map(val=>toCsvLine([val.get(0).join('/'),val.get(1)]))
//         .join('')
//     ,
    
//     getIDList: () => TT.getIdList(state.get('tree')),
//     getRootIDs: () => TT.getRootIdArray(state.get('tree')),
//   }
// }


// export const fromCsv = mkA((csv) => state => {
//   csv.split('\n').forEach(line => {
//     let {path,size} = csvLineToVal(line)
//     size = Number(size)
//     const content = new Content({size})
//     const root_id = state.get('root_id')

//     state = state.update(
//       'update_call_stack',
//       a=>a.push(tree =>TT.update(path, content, root_id, tree))
//     )

//     state = state.update('nb_update', a=>a+1)
//     state = state.update('max_depth', a=>Math.max(a, path.length))
//     state = state.update('volume', a=>a+size)
//   })
//   return state
// })


// ##############################################

export const editEntryContent = mkA((id, entry_name, new_entry_value) => state => {
  state = state.update('tree', tree =>
    tree.update(id, node =>
      node.update('content', content =>
        content.update(entry_name, a => new_entry_value))));

  return state
})

// ##############################################
