/**
 * Escape doubleQuotes with the specified character (usually " or \)
 * @param doubleQuoteEscapeCharacter
 */
const escapeDoubleQuotes = (doubleQuoteEscapeCharacter: string) => (
  stringToEscape: string
) =>
  stringToEscape.replace(
    new RegExp(`"`, "gm"),
    `${doubleQuoteEscapeCharacter}"`
  );

/**
 * Wraps a string with double quotes
 * @param wrappedString
 */
const wrapWithQuotes = (wrappedString: string): string => `"${wrappedString}"`;

interface FlattenLineOptions {
  cellSeparator: string;
  doubleQuoteEscapeCharacter: string;
}

/**
 * Transform a csv array line into a csv strong
 * @param separator - The cell separator
 * @param doubleQuoteEscapeCharacter - The character used to escape double quote. Is usually another " or a \
 */
const flattenLine = ({
  cellSeparator,
  doubleQuoteEscapeCharacter
}: FlattenLineOptions) => (lineArray: string[]): string =>
  lineArray
    .map(escapeDoubleQuotes(doubleQuoteEscapeCharacter))
    .map(wrapWithQuotes)
    .join(cellSeparator);

/**
 * Converts an matrix of strings to CSV.
 * Line separators are "\n", cell separators are ";" and double quotes are escaped by doubling them
 * @param matrix - The matrix to convert to CSV
 */
export const arrayToCsv = (matrix: string[][]): string => {
  const lineSeparator = "\n";
  const cellSeparator = ";";
  const doubleQuoteEscapeCharacter = '"';

  return matrix
    .map(flattenLine({ cellSeparator, doubleQuoteEscapeCharacter }))
    .join(lineSeparator);
};
