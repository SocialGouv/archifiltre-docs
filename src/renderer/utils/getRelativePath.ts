import path from "path";

/**
 * Gets the relative path from a base path and a file path.
 * @param basePath The base path from which to get the relative path.
 * @param filePath The file path for which to get the relative path.
 * @returns The relative path of the file.
 */
export const getRelativePath = (basePath: string, filePath: string): string =>
  `/${path.relative(basePath, filePath).replaceAll("\\", "/")}`;
