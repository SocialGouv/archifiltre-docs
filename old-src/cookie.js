


export const getCookie = () =>
  document.cookie
    .split('; ')
    .map(a=>a.split('='))
    .reduce((acc,val)=>{
      acc[val[0]]=val[1]
      return acc
    }, {})

