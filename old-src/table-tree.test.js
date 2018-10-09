import chai from 'chai'
const should = chai.should()

import { List, Record } from 'immutable'

import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as M_ from 'table-tree'
const M = Object.assign({},M_)

import V5_ from '../version/v5/src/table-tree'



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
  const toJs = a=>a
  const fromJs = a=>a

  const toCommon = a=>a
  const fromV5 = a=>a

  const arbitrary = Arbitrary.natural

  const C = {
    update,
    compare,
    toStrList,
    toStrListHeader,
    toJson,
    fromJson,
    arbitrary,
    toJs,
    fromJs,
    toCommon,
    fromV5,
  }

  M.arbitrary = M.arbitrary(update, arbitrary)
  M.update = M.update(update)
  M.sort = M.sort(compare)
  M.isSorted = M.isSorted(compare)
  M.toStrList2 = M.toStrList2(toStrListHeader, toStrList)
  M.toJson = M.toJson(toJson)
  M.fromJson = M.fromJson(fromJson)
  M.toJs = M.toJs(toJs)
  M.fromJs = M.fromJs(fromJs)

  // M.v5ToCommon = M.v5ToCommon(toCommon)
  // M.toCommon = M.toCommon(toCommon)
  // M.fromV5 = M.fromV5(fromV5)




  const isSortedToTreeToJs = function(tree) {
    let ans = true
    for (let i = 1; i < tree.children.length; i++) {
      ans = ans && tree.children[i].content <= tree.children[i-1].content
    }
    return tree.children.map(a=>isSortedToTreeToJs(a)).reduce((acc,val)=>acc && val, ans)
  }

  Loop.immuEqual('(fromJson . toJson) a', () => {
    const a = M.arbitrary()
    return [M.fromJson(M.toJson(a)), a]
  })

  Loop.immuEqual('(fromJs . toJs) a', () => {
    const a = M.arbitrary()
    return [M.fromJs(M.toJs(a)), a]
  })

  Loop.equal('(isSorted . sort) a', () => {
    const a = M.arbitrary()
    return [M.isSorted(M.sort(a)), true]
  })

  Loop.equal('(toJsTree . fromJsTree) a', () => {
    const a = M.toJsTree(M.arbitrary())
    return [M.toJsTree(M.fromJsTree(a)), a]
  })

  Loop.immuEqual('(toList . sort . fromJsTree . toJsTree) a', () => {
    const a = M.arbitrary()
    return [M.toList(M.sort(M.fromJsTree(M.toJsTree(a)))), M.toList(M.sort(a))]
  })

  Loop.equal('(size . getSubIdList root_id) a === size a', () => {
    const a = M.arbitrary()
    return [M.getSubIdList(M.getRootId(a), a).size, M.size(a)]
  })

  




  it('basic test to improve', function() {
    let a = M.init(0)
    const root_id = M.getRootId(a)

    a = M.update(['a','b','c'], 1, a)
    a = M.update(['a','b','d'], 1, a)
    a = M.update(['a','e','f'], 1, a)

    a = M.sort(a)

    M.size(a).should.equal(7)
    M.depth(a).should.equal(3)

    M.isSorted(a).should.equal(true)

    isSortedToTreeToJs(M.toJsTree(a)).should.equal(true)

    M.toStrList2(a,[]).toJS()
      .should.deep.equal([
        ['', 'path', column_name],
        ['', '', 3, ''],
        ['', 'a', 3, ''],
        ['', 'a/b', 2, ''],
        ['', 'a/b/c', 1, ''],
        ['', 'a/b/d', 1, ''],
        ['', 'a/e', 1, ''],
        ['', 'a/e/f', 1, ''],
      ])

    M.fromJson(M.toJson(a)).toJS().should.deep.equal(a.toJS())
  })

  it('sort children : const compare = (a,b) => a < b Issue', function() {
    let a = M.init(0)
    const root_id = M.getRootId(a)

    a = M.update(['a','b','c'], 1, a)
    a = M.update(['a','b','d'], 2, a)
    a = M.update(['a','e','f'], 4, a)

    a = M.sort(a)

    M.isSorted(a).should.equal(true)
    isSortedToTreeToJs(M.toJsTree(a)).should.equal(true)

    M.toJsTree(a)
      .should.deep.equal({
        name:'',
        content:7,
        parent:null,
        depth:0,
        parent_path_length:0,
        max_children_path_length: 3,
        sum_children_path_length: 9,
        children:[
          {
            name:'a',
            content:7,
            parent:null,
            depth:1,
            parent_path_length:0,
            max_children_path_length: 2,
            sum_children_path_length: 6,
            children:[
              {
                name:'e',
                content:4,
                parent:null,
                depth:2,
                parent_path_length:1,
                max_children_path_length: 1,
                sum_children_path_length: 1,
                children:[
                  {
                    name:'f',
                    content:4,
                    parent:null,
                    depth:3,
                    parent_path_length:2,
                    max_children_path_length: 0,
                    sum_children_path_length: 0,
                    children:[]
                  }
                ]
              },
              {
                name:'b',
                content:3,
                parent:null,
                depth:2,
                parent_path_length:1,
                max_children_path_length: 1,
                sum_children_path_length: 2,
                children:[
                  {
                    name:'d',
                    content:2,
                    parent:null,
                    depth:3,
                    parent_path_length:2,
                    max_children_path_length: 0,
                    sum_children_path_length: 0,
                    children:[]
                  },
                  {
                    name:'c',
                    content:1,
                    parent:null,
                    depth:3,
                    parent_path_length:2,
                    max_children_path_length: 0,
                    sum_children_path_length: 0,
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
    let a = M.init(0)
    const root_id = M.getRootId(a)

    a = M.update(['','src','csv.js'], 745, a)
    a = M.update(['','src','stats.js'], 1995, a)
    a = M.update(['','src','dict.js'], 3392, a)
    a = M.update(['','src','table-tree.js'], 3602, a)
    a = M.update(['','src','folder.js'], 2504, a)
    a = M.update(['','src','app.js'], 1445, a)
    a = M.update(['','src','cookie.js'], 174, a)
    a = M.update(['','src','api-call.js'], 4782, a)
    a = M.update(['','src','request.js'], 536, a)
    a = M.update(['','src','query-string.js'], 1166, a)
    a = M.update(['','src','base64.js'], 186, a)
    a = M.update(['','src','random-gen.js'], 441, a)
    a = M.update(['','src','scheduler.js'], 931, a)
    a = M.update(['','src','table-tree.test.js'], 2798, a)

    a = M.sort(a)

    M.isSorted(a).should.equal(true)
    isSortedToTreeToJs(M.toJsTree(a)).should.equal(true)

    // M.toJsTree(a).should.deep.equal({})
  })

  
  // const V5 = V5_(C)

  // Loop.immuEqual('(toCommon . fromV5) a === v5ToCommon a', () => {
  //   const a = V5.arbitrary()
  //   return [M.toCommon(M.fromV5(a)), M.v5ToCommon(a)]
  // })

})
