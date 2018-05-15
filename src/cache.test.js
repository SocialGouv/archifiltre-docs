import chai from 'chai'
import chaiImmutable from 'chai-immutable'
chai.use(chaiImmutable)
const should = chai.should()


import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as M from 'cache'


describe('cache', function() {

  it('basic test to improve', function() {
    let a = 0
    const f = (b) => {
      a++
      return b+1
    }
    const cacheF = M.make(f)
    
    a.should.equal(0)
    cacheF(1).should.equal(2)
    a.should.equal(1)
    cacheF(1).should.equal(2)
    a.should.equal(1)
    cacheF(2).should.equal(3)
    a.should.equal(2)
    cacheF(1).should.equal(2)
    a.should.equal(3)
  })


})
