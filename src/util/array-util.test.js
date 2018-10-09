import chai from 'chai'
const should = chai.should()

import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as M from 'util/array-util'

describe('array-util', function() {

  Loop.equal('(unzip . zip) a', () => {
    const index = ()=>1+Arbitrary.index()
    const i = index()
    const a = ()=>Arbitrary.arrayWithIndex(()=>i)(Arbitrary.natural)
    const b = Arbitrary.arrayWithIndex(index)(a)
    return [M.unzip(M.zip(b)), b]
  })

  it('join', () => {
    const a = [[1,2,3], [3,5], [9]]
    M.join(a).should.deep.equal([1,2,3,3,5,9])
  })

})
