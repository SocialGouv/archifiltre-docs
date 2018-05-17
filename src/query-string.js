
import * as Base64 from 'base64'


export function set(key,value) {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set(Base64.fromUtf8(key),Base64.fromUtf8(value))

  const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString()

  history.replaceState(null, '', newRelativePathQuery)
}

export function get(key) {
  const searchParams = new URLSearchParams(window.location.search)
  let value = searchParams.get(Base64.fromUtf8(key))
  if (value) {
    value = Base64.toUtf8(value.replace(/\//g,''))
  }
  return value
}

export function remove(key) {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.delete(Base64.fromUtf8(key))

  const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString()

  history.replaceState(null, '', newRelativePathQuery)
}




// if (qs.get('tabId') && sessionStorage.getItem(qs.get('tabId')) === null) {
//   qs.remove('tabId')
// }

// if (!qs.get('tabId')) {
//   const val = generateRandomString(40)
//   qs.set('tabId',val)
//   sessionStorage.setItem(val, 'value')
// }

// console.log(sessionStorage.getItem(qs.get('tabId')))
