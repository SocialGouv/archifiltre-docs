

export default function(css) {
  let obj = {}
  for (let a in css) {
    obj[a] = () => css[a]
  }
  return obj
}
