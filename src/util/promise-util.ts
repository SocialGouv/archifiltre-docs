/**
 * Utility function to delay the following execution
 * @param time
 */
export const wait = (time?: number) =>
  new Promise(resolve => setTimeout(resolve, time));
