import chai from 'chai'
const should = chai.should()

import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as M from 'util/record-util'

describe('record-util', function() {
  const testEquality = (a,b) => {
    a.toObject().should.deep.equal(b.toObject())
    a.constructor.toJs(a).should.deep.equal(b.constructor.toJs(b))
    a.constructor.fromJs(a.constructor.toJs(a)).toObject().should.deep.equal(
      b.constructor.fromJs(b.constructor.toJs(b)).toObject()
    )
  }

  it('compose : a . empty === empty . a', () => {
    const a = M.createFactory(
      {a:1,b:2},
      {toJs:a=>{a.b*=2;return a},fromJs:a=>{a.b*=2;return a}}
    )({a:10,b:20})
    const empty = M.emptyFactory()

    testEquality(M.compose(a,empty), a)
    testEquality(M.compose(empty,a), a)
  })


  it('compose : a . (b . c) === (a . b) . c', () => {
    const a = M.createFactory(
      {a:1,b:2,},
      {toJs:a=>{a.b*=2;return a},fromJs:a=>{a.b*=2;return a}}
    )({a:10,b:20})
    const b = M.createFactory(
      {o:'tss',em:79,a:9},
      {toJs:a=>a,fromJs:a=>a}
    )({o:'tsstss',em:0,a:1})
    const c = M.createFactory(
      {t:0},
      {toJs:a=>{return {t:'sautiensrautiena'}},fromJs:a=>a}
    )({t:3})

    testEquality(M.compose(a, M.compose(b, c)), M.compose(M.compose(a, b), c))
  })

  it('simple test', () => {
    const a = M.createFactory(
      {a:1,b:2},
      {toJs:a=>{a.b*=2;return a},fromJs:a=>{a.b*=2;return a}}
    )

    const b = M.createFactory(
      {a:10,c:20,d:30},
      {toJs:a=>{a.d*=2;return a},fromJs:a=>{a.d*=2;return a}}
    )
    const c = M.compose(b(),a().set('a',12))

    c.toObject().should.deep.equal({
      a:10,
      b:2,
      c:20,
      d:30,
    })

    c.constructor.toJs(c).should.deep.equal({
      a:10,
      b:4,
      c:20,
      d:60,
    })

    c.constructor.fromJs({
      a:10,
      b:2,
      c:20,
      d:30,
    }).toObject().should.deep.equal({
      a:10,
      b:4,
      c:20,
      d:60,
    })

    c.constructor.fromJs({
      b:2,
      d:40,
    }).toObject().should.deep.equal({
      a:10,
      b:4,
      c:20,
      d:80,
    })
  })

})
