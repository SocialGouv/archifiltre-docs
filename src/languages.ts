const defaultLanguage = "en";

declare global {
  namespace NodeJS {
    interface Global {
      navigator?: Navigator;
    }
  }
}

export const getLanguage = () =>
  // Allows this function to be called inside a NodeJS childProcess
  global.navigator
    ? [global.navigator.language.slice(0, 2)]
    : [defaultLanguage];
