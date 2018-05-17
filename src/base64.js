


export const fromUtf8 = str => {
  return window.btoa(unescape(encodeURIComponent(str)))
}

export const toUtf8 = str => {
  return decodeURIComponent(escape(window.atob(str)))
}
