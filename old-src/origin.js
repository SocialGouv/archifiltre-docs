
import * as Arbitrary from 'test/arbitrary'
import * as Loop from 'test/loop'


const arbitraryMockFile = () => {
  return {
    size:Arbitrary.natural(),
    lastModified:Arbitrary.natural(),
  }
}

const arbitraryPath = () => {
  const index = () => Arbitrary.index()+1
  const value = () => Math.floor(Math.random()*5)
  return '/'+Arbitrary.arrayWithIndex(index)(value).join('/')
}

export const arbitrary = () => {
  const index = () => Arbitrary.index()+1
  const a = Arbitrary.arrayWithIndex(index)(() => {
    return [arbitraryMockFile(), arbitraryPath()]
  })

  const compare = (a,b) => {
    if (a.length < b.length) {
      return a === b.slice(0,a.length)
    } else {
      return b === a.slice(0,b.length)
    }
  }

  return a.reduce((acc,val) => {
    const shouldAdd = acc.reduce((bool,val2) => bool && !compare(val2[1], val[1]), true)
    if (shouldAdd) {
      return acc.concat([val])
    } else {
      return acc
    }
  }, [])
}

export const sort = a => a.sort((a,b)=>{
  a = a[1]
  b = b[1]
  if (a < b) {
    return -1
  } else if (a === b) {
    return 0
  } else {
    return 1
  }
})



