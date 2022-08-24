/**
 * Escape characters that would break a regex
 * @param text
 */
export const escapeRegexText = (text: string) =>
  text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
