

export const compose = (a,b) => {
  return Object.assign({}, b, a)
}

export const hasKeys = (keys,obj) => {
  return keys.reduce((acc,val)=>acc&&obj.hasOwnProperty(val),true)
}

export const extractKeys = (keys,obj) => {
  const ans = {}
  keys.forEach(key => {
    if (obj.hasOwnProperty(key)) {
      ans[key] = obj[key]
    }
  })
  return ans
}

export const copy = a => Object.assign({},a)
