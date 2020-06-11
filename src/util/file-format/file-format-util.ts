import { once } from "events";
import fs from "fs";

type FileFormats = "utf8" | "ucs2";

/**
 * Try to guess the file format based on the file first bytes
 * @param filePath - The path of the file to inspect
 * @returns {string}
 */
export const identifyFileFormat = async (
  filePath: string
): Promise<FileFormats> => {
  const fileStream = fs.createReadStream(filePath);
  await once(fileStream, "readable");
  const fileFirstTwoBytes = fileStream.read(2);

  const ucs2FileStart = Buffer.from([0xff, 0xfe]);
  if (Buffer.compare(fileFirstTwoBytes, ucs2FileStart) === 0) {
    return "ucs2";
  }
  return "utf8";
};
