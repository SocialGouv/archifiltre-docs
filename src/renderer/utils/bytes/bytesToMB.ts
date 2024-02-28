/**
 * Converts bytes to megabytes (MB).
 * @param bytes The size in bytes to be converted.
 * @returns The size in megabytes.
 */
export const bytesToMB = (bytes: number): number => bytes / 1024 ** 2;
