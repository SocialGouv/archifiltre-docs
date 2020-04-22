import md5File from "md5-file";

/**
 * Computes the MD5 hash of a file
 * @param filePath - The absolute path of the file
 * @returns {string} - The file hash
 */
export const computeHash = (filePath: string): string => md5File.sync(filePath);
