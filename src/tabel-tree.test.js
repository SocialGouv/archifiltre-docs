import chai from 'chai'
import * as TT from 'table-tree'

const should = chai.should()

describe('table-tree', function() {
  describe('#create', function() {

    it('basic test to improve', function() {
      let a = TT.init('baba')
      const root_id = TT.getRootIdArray(a)[0]

      a = TT.update(['a','b','c'], 1, root_id, a)
      a = TT.update(['a','b','d'], 1, root_id, a)
      a = TT.update(['a','e','f'], 1, root_id, a)

      a.size.should.equal(7)
      a.get(root_id).get('size').should.equal(3)

      let b = a.toJS()
      b[root_id].children.should.have.lengthOf(1)
      b[b[root_id].children[0]].children.should.have.lengthOf(2)

      TT.remakePath(b[b[root_id].children[0]].children[0], a).toArray()
        .should.deep.equal(['baba', 'a', 'b'])

      TT.toCsvList(a).toJS()
        .should.deep.equal([
          [['a', 'b', 'c'], 1],
          [['a', 'b', 'd'], 1],
          [['a', 'e', 'f'], 1],
        ])
    })


  })
})

