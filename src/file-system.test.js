import chai from 'chai'
const should = chai.should()

import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as M from 'file-system'

import {Map,List,is} from 'immutable'

describe('file-system', function() {


  Loop.immuEqual('(qeFromJson . qeToJson) a', () => {
    const a = M.arbitraryQe()
    return [M.qeFromJson(M.qeToJson(a)), a]
  })

  Loop.immuEqual('(fromJson . toJson) a', () => {
    const a = M.arbitrary()
    return [M.fromJson(M.toJson(a)), a]
  })

  Loop.equal('(getSessionName . setSessionName x) a', () => {
    const a = Arbitrary.string()
    return [M.getSessionName(M.setSessionName(a, M.arbitrary())), a]
  })



})
