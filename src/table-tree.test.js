import chai from 'chai'
import tT from 'table-tree'
import { List } from 'immutable'

const should = chai.should()

describe('table-tree', function() {
  const update = (young,old) => young+old
  // const compare = (a,b) => a < b
  const compare = (a,b) => {
    if (a === b) {
      return 0
    } else if (a > b) {
      return -1
    } else {
      return 1
    }
  }
  const toCsvList = (a) => List.of(a)
  const TT = tT(update, compare, toCsvList)

  const isSortedToTreeToJs = function(tree) {
    let ans = true
    for (let i = 1; i < tree.children.length; i++) {
      ans = ans && tree.children[i].content <= tree.children[i-1].content
    }
    return tree.children.map(a=>isSortedToTreeToJs(a)).reduce((acc,val)=>acc && val, ans)
  }

  const isSorted = function(id,tree) {
    const getContentFromId = (id) => tree.get(id).get('content')
    const children = tree.get(id).get('children')
    let ans = true
    for (let i = 1; i < children.size; i++) {
      ans = ans && getContentFromId(children.get(i))<= getContentFromId(children.get(i-1))
    }
    return children.map(a=>isSorted(a,tree)).reduce((acc,val)=>acc && val, ans)
  }

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

      isSorted(root_id, a).should.equal(true)
      isSortedToTreeToJs(TT.toTree(root_id, a).toJS()).should.equal(true)

      TT.toCsvList(a).toJS()
        .should.deep.equal([
          [['a', 'b', 'c'], 1],
          [['a', 'b', 'd'], 1],
          [['a', 'e', 'f'], 1],
        ])
    })

    it('sort children : const compare = (a,b) => a < b Issue', function() {
      let a = TT.init(0)
      const root_id = TT.getRootIdArray(a)[0]

      a = TT.update(['a','b','c'], 1, root_id, a)
      a = TT.update(['a','b','d'], 2, root_id, a)
      a = TT.update(['a','e','f'], 4, root_id, a)

      isSorted(root_id, a).should.equal(true)
      isSortedToTreeToJs(TT.toTree(root_id, a).toJS()).should.equal(true)

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


    it('bug sort', function() {
      let a = TT.init(0)
      const root_id = TT.getRootIdArray(a)[0]

      a = TT.update(['','src','csv.js'], 745, root_id, a)
      a = TT.update(['','src','stats.js'], 1995, root_id, a)
      a = TT.update(['','src','dict.js'], 3392, root_id, a)
      a = TT.update(['','src','table-tree.js'], 3602, root_id, a)
      a = TT.update(['','src','folder.js'], 2504, root_id, a)
      a = TT.update(['','src','app.js'], 1445, root_id, a)
      a = TT.update(['','src','cookie.js'], 174, root_id, a)
      a = TT.update(['','src','api-call.js'], 4782, root_id, a)
      a = TT.update(['','src','request.js'], 536, root_id, a)
      a = TT.update(['','src','query-string.js'], 1166, root_id, a)
      a = TT.update(['','src','base64.js'], 186, root_id, a)
      a = TT.update(['','src','random-gen.js'], 441, root_id, a)
      a = TT.update(['','src','scheduler.js'], 931, root_id, a)
      a = TT.update(['','src','table-tree.test.js'], 2798, root_id, a)

      isSorted(root_id, a).should.equal(true)
      isSortedToTreeToJs(TT.toTree(root_id, a).toJS()).should.equal(true)

      TT.toTree(root_id, a).toJS().should.deep.equal({})
    })


  })
})
