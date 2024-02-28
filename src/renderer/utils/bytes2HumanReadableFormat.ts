import { translations } from "../translations/translations";
import { bytesToGB } from "./bytesToGB";
import { bytesToKB } from "./bytesToKB";
import { bytesToMB } from "./bytesToMB";
import { bytesToTB } from "./bytesToTB";

/**
 * Formats bytes into a human-readable format, converting to the most appropriate
 * unit (KB, MB, GB, TB) and appending the unit abbreviation from translations.
 * Rounds the result to one decimal place for readability.
 *
 * @param fileSizeInBytes The file size in bytes.
 * @returns A human-readable string representation of the file size.
 */
export const bytes2HumanReadableFormat = (fileSizeInBytes: number): string => {
  const unit = translations.t("common.byteChar");
  let value;
  let suffix;

  if (fileSizeInBytes >= 1024 ** 4) {
    value = bytesToTB(fileSizeInBytes);
    suffix = `T${unit}`;
  } else if (fileSizeInBytes >= 1024 ** 3) {
    value = bytesToGB(fileSizeInBytes);
    suffix = `G${unit}`;
  } else if (fileSizeInBytes >= 1024 ** 2) {
    value = bytesToMB(fileSizeInBytes);
    suffix = `M${unit}`;
  } else if (fileSizeInBytes >= 1024) {
    value = bytesToKB(fileSizeInBytes);
    suffix = `k${unit}`;
  } else {
    return `${fileSizeInBytes} ${unit}`;
  }

  return `${Math.round(value * 10) / 10} ${suffix}`;
};
