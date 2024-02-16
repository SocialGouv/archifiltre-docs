/**
 * Calculates the estimated CO2 emissions for storing a given file size in bytes over a period of one year,
 * and returns the result in milligrams, grams, or kilograms depending on the quantity.
 *
 * @param fileSizeInBytes The size of the file in bytes.
 * @returns A string indicating the estimated CO2 emissions for storing this file over one year,
 *          in milligrams if less than 0.01 gram, in grams if less than 1 kg, and in kilograms if 1 kg or more.
 */
export function getCO2ByFileSize(fileSizeInBytes: number): string {
  const fileSizeInGB = fileSizeInBytes / 1024 ** 3;

  const CO2Emission = fileSizeInGB * 11.6;

  if (CO2Emission >= 1000) {
    const CO2EmissionInKg = CO2Emission / 1000;
    return `${CO2EmissionInKg.toFixed(2)}kg of CO2 equivalent per year`;
  }
  if (CO2Emission < 0.01) {
    const CO2EmissionInMG = CO2Emission * 1000;
    return `${CO2EmissionInMG.toFixed(2)}mg of CO2 equivalent per year`;
  }

  return `${CO2Emission.toFixed(2)}g of CO2 equivalent per year`;
}
