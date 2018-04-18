

export function generateRandomString(num : number) {
  // 0-9 => 48-57 (10)
  // A-Z => 65-90 (26)
  // a-z => 97-122 (26)
  let s = ""
  for (let i = 0; i < num; i++) {
    let tmp = Math.random() * 61
    if (tmp < 10) {
      s += String.fromCharCode(48 + tmp)
    }else {
      if (tmp < 36) {
        s += String.fromCharCode(65 + (tmp-10))
      }else {
        s += String.fromCharCode(97 + (tmp-36))
      }
    }
  }
  return s
}
