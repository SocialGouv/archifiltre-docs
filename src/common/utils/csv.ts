import parse from "csv-parse";
import { promises as fs } from "fs";
import { maxBy, omit } from "lodash";

/**
 * Escape doubleQuotes with the specified character (usually " or \)
 * @param doubleQuoteEscapeCharacter
 */
const escapeDoubleQuotes =
  (doubleQuoteEscapeCharacter: string) => (stringToEscape: string) =>
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
const flattenLine =
  ({ cellSeparator, doubleQuoteEscapeCharacter }: FlattenLineOptions) =>
  (lineArray: string[]): string =>
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
  ? Record<string, string>[]
  : string[][];

const readCsvPromise = async <TOptions extends parse.Options>(
  filePath: string,
  options?: TOptions
): Promise<ReadCsvPromiseReturnType<TOptions>> => {
  const input = await fs.readFile(filePath);

  const loadedData: ReadCsvPromiseReturnType<TOptions> = await new Promise(
    (resolve, reject) => {
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
        }
      );
    }
  );

  return loadedData;
};

export interface LoadCsvFileToArrayOptions {
  delimiter: string;
}

export const loadCsvFileToArray = async (
  filePath: string,
  options: LoadCsvFileToArrayOptions
): Promise<Record<string, string>[]> =>
  readCsvPromise(filePath, {
    ...csvBaseOptions,
    ...options,
  });

export const loadCsvFirstRowToArray = async (
  filePath: string,
  options?: LoadCsvFileToArrayOptions
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

const isValidParse = (rows: unknown[][]): boolean =>
  rows.every((row) => row.length === rows[0]?.length);

const detectSeparator = async (
  filePath: string
): Promise<Delimiter | undefined> => {
  const rowsByDelimiter = await Promise.all(
    detectedDelimiter.map(async (delimiter) => {
      return {
        delimiter,
        rows: await readCsvPromise(filePath, {
          columns: false,
          delimiter,
          fromLine: 1,
          toLine: 4,
        }),
      };
    })
  );

  const validParses = rowsByDelimiter.filter(({ rows }) => isValidParse(rows));
  const longestParse = maxBy(validParses, ({ rows }) => {
    return rows[0]?.length;
  });

  return longestParse?.delimiter;
};

interface DetectedConfig {
  delimiter?: Delimiter;
}

export const detectConfig = async (
  filePath: string
): Promise<DetectedConfig> => ({
  delimiter: await detectSeparator(filePath),
});
