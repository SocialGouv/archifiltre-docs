const default_lang = "en";

export default function(obj) {
  // Allows this function to be called inside a NodeJS childProcess
  const lang = global.navigator
    ? [global.navigator.language.slice(0, 2)]
    : [default_lang];
  let key = default_lang;
  for (let i = 0; i < lang.length; i++) {
    if (obj[lang[i]]) {
      key = lang[i];
      break;
    }
  }
  return obj[key];
}
