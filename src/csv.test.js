import chai from 'chai'
import chaiImmutable from 'chai-immutable'
chai.use(chaiImmutable)
const should = chai.should()

import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as M from 'csv'


describe('csv', function() {

  Loop.equal('(line2List . list2Line) a', () => {
    const a = Arbitrary.immutableList(Arbitrary.string)
    return [M.line2List(M.list2Line(a)), a]
  })

  Loop.equal('(fromStr . toStr) a', () => {
    const a = M.arbitrary()
    return [M.fromStr(M.toStr(a)).toJS(), a.toJS()]
  })

})
