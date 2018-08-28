import chai from 'chai'
const should = chai.should()
const expect = chai.expect

import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as FilesAndFolders from 'files-and-folders'
import * as M from 'tags'

import { Set } from 'immutable'


describe('tags', function() {

  it('simple derived data test', () => {
    const ff = FilesAndFolders.computeDerived(FilesAndFolders.ff([
      [{size:1,lastModified:0},'/a/b/c'],
      [{size:2,lastModified:0},'/a/b/d'],
      [{size:3,lastModified:0},'/a/e'],
      [{size:4,lastModified:0},'/a/f/g'],
    ]))

    let tags = M.empty()
    tags = M.update(ff,tags)
    
    tags = M.push(M.create({name:'T',ff_ids:Set.of('/a/b','/a/b/d')}),tags)
    tags = M.push(M.create({name:'U',ff_ids:Set.of('/a/e','/a/b/d')}),tags)
    tags = M.push(M.create({name:'T',ff_ids:Set.of('/a/f/g')}),tags)
    tags = M.push(M.create({name:'V',ff_ids:Set()}),tags)

    tags = M.update(ff,tags)

    const test = (a,updater,predicates) => {
      Object.keys(updater).forEach(key=>a = a.update(key,updater[key]))
      Object.keys(predicates).forEach(key=>[key,a.get(key)].should.deep.equal([key,predicates[key]]))
    }

    const getter = (name,tags) => {
      const ans = tags.findEntry((val)=>val.get('name') === name)
      if (ans) {
        return ans[1]
      } else {
        return ans
      }
    }

    const updater = {
      ff_ids:a=>a.sort().toArray(),
    }

    test(getter('T',tags), updater, {
      name:'T',
      ff_ids:['/a/b','/a/b/d','/a/f/g'],
      size:7,
    })

    test(getter('U',tags), updater, {
      name:'U',
      ff_ids:['/a/b/d','/a/e'],
      size:5,
    })

    expect(getter('V',tags)).to.be.undefined

  })

})
