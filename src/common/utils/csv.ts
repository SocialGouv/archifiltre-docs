import parse from "csv-parse";
import { promises as fs } from "fs";
import { maxBy, omit } from "lodash";

/**
 * Escapes double quotes in a string using a specified character.
 * @param doubleQuoteEscapeCharacter - The character used to escape double quotes (e.g., another " or a \).
 * @returns A function that takes a string and returns it with double quotes escaped.
 */
const escapeDoubleQuotes =
  (doubleQuoteEscapeCharacter: string): ((stringToEscape: string) => string) =>
  (stringToEscape: string): string =>
    stringToEscape.replace(/"/g, `${doubleQuoteEscapeCharacter}"`);

/**
 * Wraps a string with double quotes
 * @param wrappedString
 */
const wrapWithQuotes = (wrappedString: string): string => `"${wrappedString}"`;

/**
 * Options for flattening a CSV line.
 */
interface FlattenLineOptions {
  cellSeparator: string;
  doubleQuoteEscapeCharacter: string;
}

/**
 * Transforms an array of strings (representing a CSV line) into a flattened CSV string,
 * with options for the cell separator and the double quote escape character.
 * @param options - Object containing `cellSeparator` and `doubleQuoteEscapeCharacter`.
 * @returns A function that takes an array of strings and returns a flattened CSV string.
 */
const flattenLine =
  ({ cellSeparator, doubleQuoteEscapeCharacter }: FlattenLineOptions): ((lineArray: string[]) => string) =>
  (lineArray: string[]): string =>
    lineArray.map(escapeDoubleQuotes(doubleQuoteEscapeCharacter)).map(wrapWithQuotes).join(cellSeparator);

/**
 * Converts an matrix of strings to CSV.
 * Line separators are "\n", cell separators are ";" and double quotes are escaped by doubling them
 * @param matrix - The matrix to convert to CSV
 */
export const arrayToCsv = (matrix: string[][]): string => {
  const lineSeparator = "\n";
  const cellSeparator = ";";
  const doubleQuoteEscapeCharacter = '"';

  return matrix.map(flattenLine({ cellSeparator, doubleQuoteEscapeCharacter })).join(lineSeparator);
};

const csvBaseOptions: {
  bom: true;
  columns: true;
  skipLinesWithEmptyValues: true;
} = {
  bom: true,
  columns: true,
  skipLinesWithEmptyValues: true,
};

type ReadCsvPromiseReturnType<TOptions> = TOptions extends {
  columns: Exclude<parse.Options["columns"], false>;
}
  ? Array<Record<string, string>>
  : string[][];

const readCsvPromise = async <TOptions extends parse.Options>(
  filePath: string,
  options?: TOptions,
): Promise<ReadCsvPromiseReturnType<TOptions>> => {
  const input = await fs.readFile(filePath);

  const loadedData: ReadCsvPromiseReturnType<TOptions> = await new Promise((resolve, reject) => {
    parse(
      input,
      {
        ...options,
      },
      (err, records: ReadCsvPromiseReturnType<TOptions>) => {
        if (err) {
          reject(err);
          return [];
        }
        resolve(records);
      },
    );
  });

  return loadedData;
};

export interface CsvFileLoadingOptions {
  delimiter: string;
}

export const loadCsvFileToArray = async (
  filePath: string,
  options: CsvFileLoadingOptions,
): Promise<Array<Record<string, string>>> =>
  readCsvPromise(filePath, {
    ...csvBaseOptions,
    ...options,
  });

export const assertDelimiterIsValid = (config: CsvFileLoadingOptions): void => {
  if (config.delimiter === "") {
    throw new Error("Invalid Delimiter");
  }
};

export const loadCsvFirstRowToArray = async (
  filePath: string,
  options?: CsvFileLoadingOptions,
): Promise<Record<string, string> | undefined> => {
  const metadata = await readCsvPromise(filePath, {
    ...csvBaseOptions,
    ...options,
    fromLine: 1,
    toLine: 2,
  });

  return omit(metadata[0], "");
};

const detectedDelimiter = [",", ";", "\t", "|"] as const;

type Delimiter = "," | ";" | "\t" | "|";

const isValidParse = (rows: unknown[][]): boolean => rows.every(row => row.length === rows[0]?.length);

const detectSeparator = async (filePath: string): Promise<Delimiter> => {
  const rowsByDelimiter = await Promise.all(
    detectedDelimiter.map(async delimiter => {
      return {
        delimiter,
        rows: await readCsvPromise(filePath, {
          columns: false,
          delimiter,
          fromLine: 1,
          toLine: 4,
        }),
      };
    }),
  );

  const validParses = rowsByDelimiter.filter(({ rows }) => isValidParse(rows));
  const longestParse = maxBy(validParses, ({ rows }) => {
    return rows[0]?.length;
  });

  return longestParse?.delimiter ?? ";";
};

interface DetectedConfig {
  delimiter: Delimiter;
}

export const detectConfig = async (filePath: string): Promise<DetectedConfig> => ({
  delimiter: await detectSeparator(filePath),
});
