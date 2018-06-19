import chai from 'chai'
const should = chai.should()


import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as M from 'content'

import * as V5 from '../version/v5/src/content'


describe('content', function() {

  Loop.immuEqual('(tagsFromJs . tagsToJs) a', () => {
    const a = M.arbitraryTags()
    return [M.tagsFromJs(M.tagsToJs(a)), a]
  })

  Loop.immuEqual('(lastModifiedFromJs . lastModifiedToJs) a', () => {
    const a = M.arbitraryLastModified()
    return [M.lastModifiedFromJs(M.lastModifiedToJs(a)), a]
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
    const a = M.arbitraryLastModified()
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


  Loop.equal('compareSize a (update a b)', () => {
    const a = M.arbitrary()
    const b = M.setSize(M.getSize(a) + 1 + Arbitrary.natural(), a)
    return [M.compareSize(a, b), 1]
  })

  Loop.equal('compareSize a (update b a)', () => {
    const a = M.arbitrary()
    const b = M.setSize(M.getSize(a) + 1 + Arbitrary.natural(), a)
    return [M.compareSize(b, a), -1]
  })

  Loop.equal('compareSize a a', () => {
    const a = M.arbitrary()
    return [M.compareSize(a, a), 0]
  })


  Loop.equal('compareDate a (update a b)', () => {
    const a = M.arbitrary()
    let lm = M.getLastModified(a)
    lm = M.lastModifiedUpdateAverage(a => a + 1 + Arbitrary.natural(), lm)
    const b = M.setLastModified(lm, a)
    return [M.compareDate(a, b), -1]
  })

  Loop.equal('compareDate a (update b a)', () => {
    const a = M.arbitrary()
    let lm = M.getLastModified(a)
    lm = M.lastModifiedUpdateAverage(a => a + 1 + Arbitrary.natural(), lm)
    const b = M.setLastModified(lm, a)
    return [M.compareDate(b, a), 1]
  })

  Loop.equal('compareDate a a', () => {
    const a = M.arbitrary()
    return [M.compareDate(a, a), 0]
  })



  Loop.immuEqual('(toCommon . fromV5) a === v5ToCommon a', () => {
    const a = V5.arbitrary()
    return [M.toCommon(M.fromV5(a)), M.v5ToCommon(a)]
  })

})
