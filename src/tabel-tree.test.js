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

    it('sort children by size', function() {
      let a = TT.init('baba')
      const root_id = TT.getRootIdArray(a)[0]

      a = TT.update(['a','b','c'], 1, root_id, a)
      a = TT.update(['a','b','d'], 2, root_id, a)
      a = TT.update(['a','e','f'], 4, root_id, a)

      TT.toTree(root_id, a).toJS()
        .should.deep.equal({
          name:'baba',
          size:7,
          parent:null,
          depth:0,
          children:[
            {
              name:'a',
              size:7,
              parent:null,
              depth:1,
              children:[
                {
                  name:'e',
                  size:4,
                  parent:null,
                  depth:2,
                  children:[
                    {
                      name:'f',
                      size:4,
                      parent:null,
                      depth:3,
                      children:[]
                    }
                  ]
                },
                {
                  name:'b',
                  size:3,
                  parent:null,
                  depth:2,
                  children:[
                    {
                      name:'d',
                      size:2,
                      parent:null,
                      depth:3,
                      children:[]
                    },
                    {
                      name:'c',
                      size:1,
                      parent:null,
                      depth:3,
                      children:[]
                    }
                  ]
                }
              ]
            }
          ],
        })
    })


  })
})

