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

  Loop.equal('v6JsToV7Js', () => {
    const a = V6.toJs(V6.arbitrary())
    return [(V7.toJs(V7.fromJs(Compatibility.v6JsToV7Js(a)))), Compatibility.v6JsToV7Js(a)]
  })

  Loop.equal('v7JsToV8Js', () => {
    const a = V7.toJs(V7.arbitrary())
    return [(V8.toJs(V8.fromJs(Compatibility.v7JsToV8Js(a)))), Compatibility.v7JsToV8Js(a)]
  })


})
