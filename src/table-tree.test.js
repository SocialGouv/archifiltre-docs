import chai from 'chai'
import tT from 'table-tree'
import { List } from 'immutable'

const should = chai.should()

describe('table-tree', function() {
  const update = (young,old) => young+old
  const compare = (a,b) => a < b
  const toCsvList = (a) => List.of(a)
  const TT = tT(update, compare, toCsvList)

  describe('#create', function() {

    it('basic test to improve', function() {
      let a = TT.init(0)
      const root_id = TT.getRootIdArray(a)[0]

      a = TT.update(['a','b','c'], 1, root_id, a)
      a = TT.update(['a','b','d'], 1, root_id, a)
      a = TT.update(['a','e','f'], 1, root_id, a)

      a.size.should.equal(7)
      a.get(root_id).get('content').should.equal(3)

      let b = a.toJS()
      b[root_id].children.should.have.lengthOf(1)
      b[b[root_id].children[0]].children.should.have.lengthOf(2)

      TT.remakePath(b[b[root_id].children[0]].children[0], a).toArray()
        .should.deep.equal(['', 'a', 'b'])

      TT.toCsvList(a).toJS()
        .should.deep.equal([
          [['a', 'b', 'c'], 1],
          [['a', 'b', 'd'], 1],
          [['a', 'e', 'f'], 1],
        ])
    })

    it('sort children by size', function() {
      let a = TT.init(0)
      const root_id = TT.getRootIdArray(a)[0]

      a = TT.update(['a','b','c'], 1, root_id, a)
      a = TT.update(['a','b','d'], 2, root_id, a)
      a = TT.update(['a','e','f'], 4, root_id, a)

      TT.toTree(root_id, a).toJS()
        .should.deep.equal({
          name:'',
          content:7,
          parent:null,
          depth:0,
          children:[
            {
              name:'a',
              content:7,
              parent:null,
              depth:1,
              children:[
                {
                  name:'e',
                  content:4,
                  parent:null,
                  depth:2,
                  children:[
                    {
                      name:'f',
                      content:4,
                      parent:null,
                      depth:3,
                      children:[]
                    }
                  ]
                },
                {
                  name:'b',
                  content:3,
                  parent:null,
                  depth:2,
                  children:[
                    {
                      name:'d',
                      content:2,
                      parent:null,
                      depth:3,
                      children:[]
                    },
                    {
                      name:'c',
                      content:1,
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

