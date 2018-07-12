import chai from 'chai'
const should = chai.should()

import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as M from 'file-system'

import * as V5 from '../version/v5/src/file-system'


import {Map,List,is} from 'immutable'

describe('file-system', function() {


  Loop.immuEqual('(qeFromJson . qeToJson) a', () => {
    const a = M.arbitraryQe()
    return [M.qeFromJson(M.qeToJson(a)), a]
  })

  Loop.immuEqual('(qeFromJs . qeToJs) a', () => {
    const a = M.arbitraryQe()
    return [M.qeFromJs(M.qeToJs(a)), a]
  })

  Loop.immuEqual('(contentQueueFromJson . contentQueueToJson) a', () => {
    const a = M.arbitraryContentQueue()
    return [M.contentQueueFromJson(M.contentQueueToJson(a)), a]
  })

  Loop.immuEqual('(contentQueueFromJs . contentQueueToJs) a', () => {
    const a = M.arbitraryContentQueue()
    return [M.contentQueueFromJs(M.contentQueueToJs(a)), a]
  })

  Loop.immuEqual('(tagsFromJson . tagsToJson) a', () => {
    const a = M.arbitraryTags()
    return [M.tagsFromJson(M.tagsToJson(a)), a]
  })

  Loop.immuEqual('(tagsFromJs . tagsToJs) a', () => {
    const a = M.arbitraryTags()
    return [M.tagsFromJs(M.tagsToJs(a)), a]
  })




  Loop.immuEqual('(fromJson . toJson) a', () => {
    const a = M.arbitrary()
    return [M.fromJson(M.toJson(a)), a]
  })

  Loop.immuEqual('(fromJs . toJs) a', () => {
    const a = M.arbitrary()
    return [M.fromJs(M.toJs(a)), a]
  })

  Loop.equal('(getSessionName . setSessionName x) a', () => {
    const a = Arbitrary.string()
    return [M.getSessionName(M.setSessionName(a, M.arbitrary())), a]
  })


  // Loop.immuEqual('(toCommon . fromV5) a === v5ToCommon a', () => {
  //   const a = V5.arbitrary()
  //   return [M.toCommon(M.fromV5(a)), M.v5ToCommon(a)]
  // })


})
