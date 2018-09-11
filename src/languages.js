
console.log(navigator.language, navigator.languages)

const default_lang = 'en'

export default function(obj) {
  // const lang = navigator.languages
  const lang = [navigator.language.slice(0,2)]
  let key = default_lang
  for (let i = 0; i < lang.length; i++) {
    if (obj[lang[i]]) {
      key = lang[i]
      break
    }
  }
  return obj[key]
}
