/**
 * Converts bytes to terabytes (TB).
 * @param bytes The size in bytes to be converted.
 * @returns The size in terabytes.
 */
export const bytesToTB = (bytes: number): number => bytes / 1024 ** 4;
