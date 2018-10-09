
export const zip = a => {
  return a[0].map((_,i)=>a.map(a=>a[i]))
}

export const unzip = zip

export const join = a => {
  return a.reduce((acc,val)=>acc.concat(val),[])
}

export const computeCumulative = array => {
  const ans = [0]
  for (let i = 0; i < array.length - 1; i++) {
    ans.push(array[i] + ans[i])
  }
  return ans
}

export const empty = []
