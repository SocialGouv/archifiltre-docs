/**
 * Calculates CO2 emissions in grams for a given file size in gigabytes over one year.
 *
 * @param fileSizeInGB The size of the file in gigabytes.
 * @returns The estimated CO2 emissions in grams.
 */
export function calculateCO2Emissions(fileSizeInGB: number): number {
  return fileSizeInGB * 11.6;
}
