/**
 * Checks if a given file path is within an compressed folder.
 *
 * @param {string} filePath - The file path to check.
 * @returns {boolean} Returns 'true' if the file path is within an compressed folder, otherwise 'false'.
 */
export const isInCompressedFolder = (filePath: string): boolean => {
  const normalizedFilePath = filePath.replace(/\\/g, "/");
  const segments = normalizedFilePath.split("/");

  return segments.some((segment) => segment.endsWith(".zip"));
};
