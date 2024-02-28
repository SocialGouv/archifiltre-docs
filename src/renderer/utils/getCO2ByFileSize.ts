import { bytesToGB } from "./bytes";
import { calculateCO2Emissions } from "./calculateCO2Emissions";
import { formatCO2Emissions } from "./formatCO2Emissions";

/**
 * Calculates the estimated CO2 emissions for storing a given file size in bytes over a period of one year,
 * and returns the result in a human-readable format.
 *
 * @param fileSizeInBytes The size of the file in bytes.
 * @returns A string indicating the estimated CO2 emissions for storing this file over one year,
 *          formatted in milligrams, grams, or kilograms.
 */
export function getCO2ByFileSize(fileSizeInBytes: number): string {
  const fileSizeInGB = bytesToGB(fileSizeInBytes);
  const CO2EmissionInGrams = calculateCO2Emissions(fileSizeInGB);
  return formatCO2Emissions(CO2EmissionInGrams);
}
