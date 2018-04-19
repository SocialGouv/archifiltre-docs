


export const utf8Tob64 = str => {
  return window.btoa(unescape(encodeURIComponent(str)))
}

export const b64Toutf8 = str => {
  return decodeURIComponent(escape(window.atob(str)))
}
