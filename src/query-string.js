
import { b64Toutf8, utf8Tob64 } from 'base64'


export function set(key,value) {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set(utf8Tob64(key),utf8Tob64(value))

  const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString()

  history.replaceState(null, '', newRelativePathQuery)
}

export function get(key) {
  const searchParams = new URLSearchParams(window.location.search)
  let value = searchParams.get(utf8Tob64(key))
  if (value) {
    value = b64Toutf8(value.replace(/\//g,''))
  }
  return value
}

export function remove(key) {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.delete(utf8Tob64(key))

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
