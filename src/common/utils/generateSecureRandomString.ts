import { randomBytes } from "crypto";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generates a secure, random string of the specified length using Node.js's `randomBytes`.
 *
 * This function is suitable for scenarios requiring strong security assurances like token or password generation.
 *
 * @param {number} length - The desired length of the random string.
 * @returns {string} A randomly generated, secure string.
 */
export function generateSecureRandomString(length: number): string {
  const bytes = randomBytes(length);

  return Array.from(bytes)
    .map(byte => CHARACTERS.charAt(byte % CHARACTERS.length))
    .join("");
}
