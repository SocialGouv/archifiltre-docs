import chai from 'chai'
const should = chai.should()

import tT from 'table-tree'
import { List } from 'immutable'

import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'


describe('table-tree', function() {
  const update = (young,old) => young+old
  const compare = (a,b) => {
    if (a === b) {
      return 0
    } else if (a > b) {
      return -1
    } else {
      return 1
    }
  }
  const toStrList = (a) => List.of(a)
  const column_name = 'num'
  const toStrListHeader = () => List.of(column_name)
  const toJson = JSON.stringify
  const fromJson = JSON.parse

  const arbitrary = Arbitrary.natural

  const TT = tT({
    update,
    compare,
    toStrList,
    toStrListHeader,
    toJson,
    fromJson,
    arbitrary
  })

  const isSortedToTreeToJs = function(tree) {
    let ans = true
    for (let i = 1; i < tree.children.length; i++) {
      ans = ans && tree.children[i].content <= tree.children[i-1].content
    }
    return tree.children.map(a=>isSortedToTreeToJs(a)).reduce((acc,val)=>acc && val, ans)
  }

  Loop.immuEqual('(fromJson . toJson) a', () => {
    const a = TT.arbitrary()
    return [TT.fromJson(TT.toJson(a)), a]
  })

  Loop.equal('(isSorted . sort) a', () => {
    const a = TT.arbitrary()
    return [TT.isSorted(TT.sort(a)), true]
  })

  Loop.equal('(toJsTree . fromJsTree) a', () => {
    const a = TT.toJsTree(TT.arbitrary())
    return [TT.toJsTree(TT.fromJsTree(a)), a]
  })

  Loop.immuEqual('(toList . sort . fromJsTree . toJsTree) a', () => {
    const a = TT.arbitrary()
    return [TT.toList(TT.sort(TT.fromJsTree(TT.toJsTree(a)))), TT.toList(TT.sort(a))]
  })

  




  it('basic test to improve', function() {
    let a = TT.init(0)
    const root_id = TT.getRootId(a)

    a = TT.update(['a','b','c'], 1, a)
    a = TT.update(['a','b','d'], 1, a)
    a = TT.update(['a','e','f'], 1, a)

    a = TT.sort(a)

    TT.size(a).should.equal(7)
    TT.depth(a).should.equal(3)
    // TT.getEntryById(root_id, a).get('content').should.equal(3)

    // let b = a.toJS()
    // b[root_id].children.should.have.lengthOf(1)
    // b[b[root_id].children[0]].children.should.have.lengthOf(2)

    // TT.remakePath(b[b[root_id].children[0]].children[0], a).toArray()
    //   .should.deep.equal(['', 'a', 'b'])

    TT.isSorted(a).should.equal(true)

    isSortedToTreeToJs(TT.toJsTree(a)).should.equal(true)

    TT.toStrList2(a).toJS()
      .should.deep.equal([
        ['path', column_name],
        ['a/b/c', 1],
        ['a/b/d', 1],
        ['a/e/f', 1],
      ])

    TT.fromJson(TT.toJson(a)).toJS().should.deep.equal(a.toJS())
  })

  it('sort children : const compare = (a,b) => a < b Issue', function() {
    let a = TT.init(0)
    const root_id = TT.getRootId(a)

    a = TT.update(['a','b','c'], 1, a)
    a = TT.update(['a','b','d'], 2, a)
    a = TT.update(['a','e','f'], 4, a)

    a = TT.sort(a)

    TT.isSorted(a).should.equal(true)
    isSortedToTreeToJs(TT.toJsTree(a)).should.equal(true)

    TT.toJsTree(a)
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
    const root_id = TT.getRootId(a)

    a = TT.update(['','src','csv.js'], 745, a)
    a = TT.update(['','src','stats.js'], 1995, a)
    a = TT.update(['','src','dict.js'], 3392, a)
    a = TT.update(['','src','table-tree.js'], 3602, a)
    a = TT.update(['','src','folder.js'], 2504, a)
    a = TT.update(['','src','app.js'], 1445, a)
    a = TT.update(['','src','cookie.js'], 174, a)
    a = TT.update(['','src','api-call.js'], 4782, a)
    a = TT.update(['','src','request.js'], 536, a)
    a = TT.update(['','src','query-string.js'], 1166, a)
    a = TT.update(['','src','base64.js'], 186, a)
    a = TT.update(['','src','random-gen.js'], 441, a)
    a = TT.update(['','src','scheduler.js'], 931, a)
    a = TT.update(['','src','table-tree.test.js'], 2798, a)

    a = TT.sort(a)

    TT.isSorted(a).should.equal(true)
    isSortedToTreeToJs(TT.toJsTree(a)).should.equal(true)

    // TT.toJsTree(a).should.deep.equal({})
  })


})
