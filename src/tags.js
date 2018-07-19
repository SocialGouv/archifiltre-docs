
import { generateRandomString } from 'random-gen'
import * as RecordUtil from 'util/record-util'

import { List, Map, Set } from 'immutable'

const v_tag = RecordUtil.createFactory({
  name:'',
  ff_ids:Set(),
}, a => {
  return {
    name:a.get('name'),
    ff_ids:a.get('ff_ids').toArray(),
  }
}, a => {
  return {
    name:a.name,
    ff_ids:Set(a.ff_ids),
  }
})


const v_derived = RecordUtil.createFactory({
  size:0,
}, a => {
  return {}
}, a => {
  return {}
})


export const create = RecordUtil.compose(v_derived, v_tag)

const makeId = () => generateRandomString(40)


export const empty = Map

const insert = (id,tag,tags) => {
  const already_id = tags.reduce((acc,val,i) => {
    if (val.get('name') === tag.get('name')) {
      acc = i
    }
    return acc
  }, undefined)

  if (already_id) {
    tags = tags.update(already_id,a=>a.update('ff_ids', b=>b.concat(tag.get('ff_ids'))))
  } else {
    tags = tags.set(id, tag)
  }
  return tags
}

export const push = (tag,tags) => tags.set(makeId(), tag)

const computeDerived = (ffs,tags) => {
  
}

export const update = (ffs,tags) => {
  tags = tags.reduce((acc,val,id)=>insert(id,val,acc),empty())
  tags = computeDerived(ffs,tags)

  return tags
}