import { translations } from "../translations/translations";

/**
 * Formats CO2 emissions for display.
 *
 * @param emissionsInGrams The amount of CO2 emissions in grams.
 * @returns A string indicating the estimated CO2 emissions for storing this file over one year,
 *          formatted in milligrams, grams, or kilograms.
 */
export function formatCO2Emissions(emissionsInGrams: number): string {
  if (emissionsInGrams >= 1000) {
    return `${(emissionsInGrams / 1000).toFixed(2)}${translations.t("co2.kgPerYear")}`;
  } else if (emissionsInGrams < 0.01) {
    return `${(emissionsInGrams * 1000).toFixed(2)}${translations.t("co2.mgPerYear")}`;
  }

  return `${emissionsInGrams.toFixed(2)}${translations.t("co2.gPerYear")}`;
}
