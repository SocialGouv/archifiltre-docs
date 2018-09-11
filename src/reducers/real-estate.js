

import * as ObjectUtil from 'util/object-util'
import * as Arbitrary from 'test/arbitrary'

export const arbitrary = () => {
  const state = {
    property_name:Arbitrary.string(),
    initialState:()=>0,
    reader:{
      isZero:()=>s=>s===0,
      print:(blabla)=>s=>blabla+' : '+s,
    },
    writer:{
      add:(a)=>s=>s+a,
      sub:(a)=>s=>s-a,
    }
  }
  return create(state)
}


export const create = (state) => {
  const property_name = state.property_name
  const get = s => s[property_name]
  const set = (a,s) => ObjectUtil.compose({[property_name]:a},s)

  const initialState = s => set(state.initialState(),s)

  const reader = {}
  for (let key in state.reader) {
    updateGetAndSet(get,set,property_name,key,state.reader,reader)
  }
  const writer = {}
  for (let key in state.writer) {
    updateGetAndSet(get,set,property_name,key,state.writer,writer)
  }

  return {
    initialState,
    reader,
    writer,
  }
}

const updateGetAndSet = (get,set,property_name,old_key,old_obj,new_obj) => {
  let new_key = old_key
  let update = (a,b)=>[a].concat(b)

  if (old_obj[old_key].get === undefined) {
    new_key = property_name+'|'+old_key
    update = (a,b)=>[a]
  }

  new_obj[new_key] = (...args) => old_obj[old_key](...args)
  new_obj[new_key].get = update(get,old_obj[old_key].get)
  new_obj[new_key].set = update(set,old_obj[old_key].set) 
}

export const empty = () => {
  const initialState = s => s
  const reader = {}
  const writer = {}
  return {
    initialState,
    reader,
    writer,
  }
}

export const compose = (a,b) => {
  const initialState = s => a.initialState(b.initialState(s))
  const reader = ObjectUtil.compose(a.reader,b.reader)
  const writer = ObjectUtil.compose(a.writer,b.writer)
  return {
    initialState,
    reader,
    writer,
  }
}




const compileGet = (get) => {
  if (get.length === 0) {
    return s=>s
  } else {
    return s=>compileGet(get.slice(1))(get[0](s))
  }
}

const compileSet = (get,set) => {
  if (set.length === 0) {
    return (a,s)=>a
  } else {
    return (a,s)=>set[0](compileSet(get.slice(1),set.slice(1))(a,get[0](s)),s)
  }
}

const cache = (f) => {
  const equal = (a,b) => a === b
  let last_args = [Symbol()]
  let last_state = Symbol()
  let last_ans
  return (...args) => state => {
    const same_args = args.reduce((acc,val,ind) => acc && val === last_args[ind],true)
    if (same_args === false || equal(last_state,state) === false) {
      last_args = args
      last_state = state
      last_ans = f(...args)(state)
    }
    return last_ans
  }
}

export const compile = (real_estate) => {
  const initialState = () => real_estate.initialState({})
  const api = {}

  for (let key in real_estate.reader) {
    const f = real_estate.reader[key]
    const get = compileGet(f.get)
    const cachedF = cache(f)
    api[key] = (...args) => state => cachedF(...args)(get(state))
    delete api[key].get
    delete api[key].set
    api[key].reader = true
  }

  for (let key in real_estate.writer) {
    const f = real_estate.writer[key]
    const get = compileGet(f.get)
    const set = compileSet(f.get,f.set)
    api[key] = (...args) => state => set(f(...args)(get(state)),state)
    delete api[key].get
    delete api[key].set
    api[key].writer = true
  }

  for (let key in api) {
    const split = key.split('|')
    
    if (api[split[0]] === undefined) {
      api[split[0]] = {}
    }
    api[split[0]][split[1]] = api[key]
    delete api[key]
  }

  return {
    initialState,
    api,
  }
}






export const createHigherOrder = (higher_order) => {
  const get = higher_order.get
  const set = higher_order.set

  return (property_name,real_estate) => {
    const initialState = () => higher_order.initialState(real_estate.initialState({}))
    const reader = {}
    for (let key in real_estate.reader) {
      updateGetAndSet(get,set,property_name,key,real_estate.reader,reader)
    }
    const writer = {}
    for (let key in real_estate.writer) {
      updateGetAndSet(get,set,property_name,key,real_estate.writer,writer)
    }
    return create({
      property_name,
      initialState,
      reader:ObjectUtil.compose(higher_order.reader,reader),
      writer:ObjectUtil.compose(higher_order.writer,writer),
    })
  }
}
