import iconv from "iconv-lite";
import { isWindows } from "util/os/os-util";

/**
 * Converts the RESIP csv to the windows1252 format if archifiltre is run on windows.
 * This is the format used by RESIP if it's running on windows, while UTF-8 is used on OSX and linux platforms.
 * @param fileContent - The csv content for the resip export
 * @returns {string}
 */
export const formatFileContentForResip = (fileContent: string): Buffer => {
  if (isWindows()) {
    return iconv.encode(fileContent, "CP1252");
  }

  return Buffer.from(fileContent);
};
