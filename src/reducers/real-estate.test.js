import chai from 'chai'
const should = chai.should()

import * as Loop from 'test/loop'
import * as Arbitrary from 'test/arbitrary'
import * as M from 'reducers/real-estate'

import * as ObjectUtil from 'util/object-util'


describe('real-estate', function() {
  // Loop.equal('compose : a . empty === empty . a', () => {
  //   const a = M.arbitrary()
  //   return [M.compose(a,M.empty()), M.compose(M.empty(),a)]
  // })

  // Loop.equal('compose : a . (b . c) === (a . b) . c', () => {
  //   const a = M.arbitrary()
  //   const b = M.arbitrary()
  //   const c = M.arbitrary()
  //   return [M.compose(a,M.compose(b,c)), M.compose(M.compose(a,b),c)]
  // })

  const state1 = M.create({
    property_name:'state1',
    initialState:()=>0,
    reader:{
      isZero:()=>s=>s===0,
      print:(blabla)=>s=>blabla+' : '+s,
    },
    writer:{
      add:(a)=>s=>s+a,
      sub:(a)=>s=>s-a,
    }
  })

  const state2 = M.create({
    property_name:'state2',
    initialState:()=>{return{baba:'baba'}},
    reader:{
      read:()=>s=>s.baba,
    },
    writer:{
      write:(a)=>s=>{
        s = Object.assign({},s)
        s.baba = a
        return s
      },
    }
  })

  const higherOrder = M.createHigherOrder({
    initialState:s=>{return{origin:s,current:s}},
    get:s=>s.current,
    set:(a,s)=>ObjectUtil.compose({current:a},s),
    reader:{
      getCurrent:()=>s=>s.current,
    },
    writer:{
      goBackToOrigin:()=>s=>{return{origin:s.origin,current:s.origin}},
    }
  })


  it('basic test', () => {
    const {initialState,api} = M.compile(M.compose(state2,state1))

    let store = initialState()

    store.should.deep.equal({
      state1:0,
      state2:{
        baba:'baba'
      }
    })

    store = api.state2.write('ahah')(store)
    store = api.state1.add(10)(store)
    store = api.state1.sub(6)(store)

    store.should.deep.equal({
      state1:4,
      state2:{
        baba:'ahah'
      }
    })

    api.state2.read()(store).should.deep.equal('ahah')
    api.state1.isZero()(store).should.deep.equal(false)
    api.state1.print('titre')(store).should.deep.equal('titre : 4')

  })

  it('higher order test', () => {
    const {initialState,api} = M.compile(higherOrder('ho',M.compose(state2,state1)))

    let store = initialState()

    store.should.deep.equal({
      ho:{
        origin:{
          state1:0,
          state2:{
            baba:'baba'
          }
        },
        current:{
          state1:0,
          state2:{
            baba:'baba'
          }
        }
      }
    })

    store = api.state2.write('ahah')(store)
    store = api.state1.add(10)(store)
    store = api.state1.sub(6)(store)

    store.should.deep.equal({
      ho:{
        origin:{
          state1:0,
          state2:{
            baba:'baba'
          }
        },
        current:{
          state1:4,
          state2:{
            baba:'ahah'
          }
        }
      }
    })

    api.state2.read()(store).should.deep.equal('ahah')
    api.state1.isZero()(store).should.deep.equal(false)
    api.state1.print('titre')(store).should.deep.equal('titre : 4')

    api.ho.getCurrent()(store).should.deep.equal({
      state1:4,
      state2:{
        baba:'ahah'
      }
    })

    store = api.ho.goBackToOrigin()(store)

    api.ho.getCurrent()(store).should.deep.equal({
      state1:0,
      state2:{
        baba:'baba'
      }
    })

    store.should.deep.equal({
      ho:{
        origin:{
          state1:0,
          state2:{
            baba:'baba'
          }
        },
        current:{
          state1:0,
          state2:{
            baba:'baba'
          }
        }
      }
    })

  })


  it('cache test', () => {
    let sideeffect = 0
    const state = M.create({
      property_name:'state',
      initialState:()=>0,
      reader:{
        isZero:()=>s=>{
          sideeffect++
          return s===0
        },
      },
      writer:{
        add:(a)=>s=>s+a,
      }
    })

    const {initialState,api} = M.compile(state)

    let store = initialState()

    store.should.deep.equal({state:0})

    sideeffect.should.equal(0)
    api.state.isZero()(store)
    sideeffect.should.equal(1)
    api.state.isZero()(store)
    sideeffect.should.equal(1)

    store = api.state.add(10)(store)
    api.state.isZero()(store)
    sideeffect.should.equal(2)
    api.state.isZero()(store)
    sideeffect.should.equal(2)
  })

})

