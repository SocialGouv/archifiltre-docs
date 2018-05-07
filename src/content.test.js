import chai from 'chai'
import chaiImmutable from 'chai-immutable'
// chai.use(chaiImmutable)
const should = chai.should()


import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as M from 'content'


describe('content', function() {

  Loop.immuEqual('(fromJson . toJson) a', () => {
    const a = M.arbitrary()
    return [M.fromJson(M.toJson(a)), a]
  })

  Loop.equal('(getSize . setSize x) a', () => {
    const a = Arbitrary.natural()
    return [M.getSize(M.setSize(a, M.arbitrary())), a]
  })

  Loop.equal('(getLastModified . setLastModified x) a', () => {
    const a = Arbitrary.natural()
    return [M.getLastModified(M.setLastModified(a, M.arbitrary())), a]
  })

  Loop.equal('compare a (update a b)', () => {
    const a = M.arbitrary()
    const b = M.setSize(M.getSize(a) + 1 + Arbitrary.natural(), a)
    return [M.compare(a, b), 1]
  })

  Loop.equal('compare a (update b a)', () => {
    const a = M.arbitrary()
    const b = M.setSize(M.getSize(a) + 1 + Arbitrary.natural(), a)
    return [M.compare(b, a), -1]
  })

  Loop.equal('compare a a', () => {
    const a = M.arbitrary()
    return [M.compare(a, a), 0]
  })

})
