
import * as ObjectUtil from 'util/object-util'
import { Record } from 'immutable'

const f = Symbol()

export const composeFactory = (a,b) => {
  const obj = ObjectUtil.compose(a().toObject(),b().toObject())
  const toJs = c => ObjectUtil.compose(a[f].toJs(c),b[f].toJs(c))
  const fromJs = c => ObjectUtil.compose(a[f].fromJs(c),b[f].fromJs(c))
  return createFactory(obj, {toJs, fromJs})
}

export const compose = (a,b) => {
  const factory = composeFactory(a.constructor, b.constructor)
  return factory(ObjectUtil.compose(a.toObject(),b.toObject()))
}

// export const emptyFactory = () => {
//   const obj = {}
//   const toJs = a=>a
//   const fromJs = a=>a
//   return createFactory(obj, {toJs, fromJs})()
// }

export const createFactory = (obj, {toJs, fromJs}) => {
  const a = Record(obj)
  const keys = Object.keys(obj)
  
  a[f] = {
    toJs:a=>toJs(ObjectUtil.extractKeys(keys,a)),
    fromJs:a=>fromJs(ObjectUtil.extractKeys(keys,a)),
  }

  a.toJs = c => a[f].toJs(c.toObject())
  a.fromJs = c => a(a[f].fromJs(c))
  return a
}

export const emptyFactory = (() => {
  const obj = {}
  const toJs = a=>a
  const fromJs = a=>a
  return createFactory(obj, {toJs, fromJs})
})()

