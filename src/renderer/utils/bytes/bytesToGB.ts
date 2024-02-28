/**
 * Converts bytes to gigabytes (GB).
 * @param bytes The size in bytes to be converted.
 * @returns The size in gigabytes.
 */
export const bytesToGB = (bytes: number): number => bytes / 1024 ** 3;
