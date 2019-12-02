const defaultLang = "en";

export const getLanguage = () =>
  global.navigator ? [global.navigator.language.slice(0, 2)] : [defaultLang];

export default function(obj) {
  // Allows this function to be called inside a NodeJS childProcess
  const language = getLanguage();
  let key = defaultLang;
  for (let i = 0; i < language.length; i++) {
    if (obj[language[i]]) {
      key = language[i];
      break;
    }
  }
  return obj[key];
}
