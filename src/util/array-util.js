
export const zip = a => {
  return a[0].map((_,i)=>a.map(a=>a[i]))
}

export const unzip = zip

export const join = a => {
  return a.reduce((acc,val)=>acc.concat(val),[])
}