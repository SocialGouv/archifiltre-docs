import chai from 'chai'
const should = chai.should()

import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'

import * as Compatibility from 'compatibility'

import * as V5 from '../version/v5/src/file-system'
import * as V6 from '../version/v6/src/file-system'
import * as V7 from '../version/v7/src/file-system'

import * as V8 from 'file-system'


describe('file-system', function() {


  Loop.equal('v5JsToV6Js', () => {
    const a = V5.toJs(V5.arbitrary())
    return [(V6.toJs(V6.fromJs(Compatibility.v5JsToV6Js(a)))), Compatibility.v5JsToV6Js(a)]
  })

  // it('test', ()=>{

  //   // const b = Compatibility.v6JsToCommon56(V6.toJs(V6.fromJs(Compatibility.v5JsToV6Js(a))))
  //   // const c = Compatibility.v5JsToCommon56(a)


  //   const b = (V6.toJs(V6.fromJs(Compatibility.v5JsToV6Js(a))))
  //   const c = Compatibility.v5JsToV6Js(a)    
  //   b.should.deep.equal(c)
  // })

  // Loop.immuEqual('(qeFromJson . qeToJson) a', () => {
  //   const a = M.arbitraryQe()
  //   return [M.qeFromJson(M.qeToJson(a)), a]
  // })

  // Loop.immuEqual('(qeFromJs . qeToJs) a', () => {
  //   const a = M.arbitraryQe()
  //   return [M.qeFromJs(M.qeToJs(a)), a]
  // })

  // Loop.immuEqual('(contentQueueFromJson . contentQueueToJson) a', () => {
  //   const a = M.arbitraryContentQueue()
  //   return [M.contentQueueFromJson(M.contentQueueToJson(a)), a]
  // })

  // Loop.immuEqual('(contentQueueFromJs . contentQueueToJs) a', () => {
  //   const a = M.arbitraryContentQueue()
  //   return [M.contentQueueFromJs(M.contentQueueToJs(a)), a]
  // })

  // Loop.immuEqual('(tagsFromJson . tagsToJson) a', () => {
  //   const a = M.arbitraryTags()
  //   return [M.tagsFromJson(M.tagsToJson(a)), a]
  // })

  // Loop.immuEqual('(tagsFromJs . tagsToJs) a', () => {
  //   const a = M.arbitraryTags()
  //   return [M.tagsFromJs(M.tagsToJs(a)), a]
  // })




  // Loop.immuEqual('(fromJson . toJson) a', () => {
  //   const a = M.arbitrary()
  //   return [M.fromJson(M.toJson(a)), a]
  // })

  // Loop.immuEqual('(fromJs . toJs) a', () => {
  //   const a = M.arbitrary()
  //   return [M.fromJs(M.toJs(a)), a]
  // })



  // Loop.immuEqual('(toCommon . fromV5) a === v5ToCommon a', () => {
  //   const a = V5.arbitrary()
  //   return [M.toCommon(M.fromV5(a)), M.v5ToCommon(a)]
  // })


})
