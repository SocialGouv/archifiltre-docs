
export const request = obj => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open(obj.method || 'GET', obj.url)
    if (obj.headers) {
      Object.keys(obj.headers).forEach(key => {
        xhr.setRequestHeader(key, obj.headers[key])
      })
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        reject(xhr.statusText)
      }
    }
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send(obj.body)
  })
}

export const utf8Tob64 = str => {
  return window.btoa(unescape(encodeURIComponent( str )));
}

export const b64Toutf8 = str => {
  return decodeURIComponent(escape(window.atob( str )));
}