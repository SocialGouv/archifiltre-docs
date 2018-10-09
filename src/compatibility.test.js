import chai from 'chai'
const should = chai.should()

import { updateIn } from 'immutable'

import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'

import * as Compatibility from 'compatibility'

import * as V5 from '../version/v5/src/file-system'
import * as V6 from '../version/v6/src/file-system'
import * as V7 from '../version/v7/src/file-system'
import * as V8 from '../version/v8/src/file-system'

import * as V9 from 'datastore/virtual-file-system'


describe('compatibility', function() {

  const sortV6 = a => {
    return updateIn(a,['tags'],tags=>{
      for (let key in tags) {
        tags[key] = tags[key].sort()
      }
      return tags
    })
  }

  Loop.equal('v5JsToV6Js', () => {
    const a = V5.toJs(V5.arbitrary())
    return [sortV6(V6.toJs(V6.fromJs(Compatibility.v5JsToV6Js(a)))), sortV6(Compatibility.v5JsToV6Js(a))]
  })

  Loop.equal('v6JsToV7Js', () => {
    const a = V6.toJs(V6.arbitrary())
    return [(V7.toJs(V7.fromJs(Compatibility.v6JsToV7Js(a)))), Compatibility.v6JsToV7Js(a)]
  })

  // // Issue with arbitrary, content_id doesn't exist in table !!!!
  // Loop.equal('v7JsToV8Js', () => {
  //   const a = V7.toJs(V7.arbitrary())
  //   return [(V8.toJs(V8.fromJs(Compatibility.v7JsToV8Js(a)))), Compatibility.v7JsToV8Js(a)]
  // })

  const sortV9 = a => {
    return updateIn(a,['tags'],tags=>{
      for (let key in tags) {
        tags[key].ff_ids = tags[key].ff_ids.sort()
      }
      return tags
    })
  }

  // Loop.equal('v8JsToV9Js', () => {
  //   const a = V8.toJs(V8.arbitrary())
  //   return [sortV9(V9.toJs(V9.fromJs(Compatibility.v8JsToV9Js(a)))), sortV9(Compatibility.v8JsToV9Js(a))]
  // })


})
