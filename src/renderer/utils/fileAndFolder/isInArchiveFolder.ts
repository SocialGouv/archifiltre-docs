/**
 * Checks if a given file path is within an archive folder.
 *
 * @param {string} filePath - The file path to check.
 *
 * @returns {boolean} Returns 'true' if the file path is within an archive folder, otherwise 'false'.
 */
export const isInArchiveFolder = (filePath: string): boolean =>
  filePath.includes(".zip/") || filePath.endsWith(".zip");
