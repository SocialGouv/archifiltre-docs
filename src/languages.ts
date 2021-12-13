const defaultLanguage = "en";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            navigator?: Navigator;
        }
    }
}

export const getLanguage = (): string[] =>
    // Allows this function to be called inside a NodeJS childProcess
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    global.navigator
        ? [global.navigator.language.slice(0, 2)]
        : [defaultLanguage];
