import chai from 'chai'
const should = chai.should()


import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as M from 'content'


describe('content', function() {

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

  Loop.equal('(getSize . setSize x) a', () => {
    const a = Arbitrary.natural()
    return [M.getSize(M.setSize(a, M.arbitrary())), a]
  })

  Loop.equal('(getLastModified . setLastModified x) a', () => {
    const a = Arbitrary.natural()
    return [M.getLastModified(M.setLastModified(a, M.arbitrary())), a]
  })

  Loop.equal('(getAlias . setAlias x) a', () => {
    const a = Arbitrary.string()
    return [M.getAlias(M.setAlias(a, M.arbitrary())), a]
  })

  Loop.equal('(getComments . setComments x) a', () => {
    const a = Arbitrary.string()
    return [M.getComments(M.setComments(a, M.arbitrary())), a]
  })

  Loop.equal('(getTags . setTags x) a', () => {
    const a = M.arbitraryTags()
    return [M.getTags(M.setTags(a, M.arbitrary())), a]
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
