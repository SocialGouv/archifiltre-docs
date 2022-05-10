import fs from "fs";
import path from "path";

/**
 * Recursively creates full directories and files structure from given template.
 *
 * If entry is object, a directory is created;
 * If entry is string or Buffer, a file with given content is created;
 */
export const createStructure = async (
  structure: Directory,
  override = false,
  basePath = ""
): Promise<void> => {
  for (const [dirPath, dirContent] of Object.entries(structure)) {
    const fullPath = path.resolve(basePath, dirPath);
    if (fs.existsSync(fullPath) && !override) {
      continue;
    }
    if (typeof dirContent === "string" || Buffer.isBuffer(dirContent)) {
      // entry is file
      await fs.promises.writeFile(fullPath, dirContent, {});
      continue;
    }
    // entry is directory
    await fs.promises.mkdir(fullPath, {
      recursive: true,
    });
    await createStructure(dirContent, override, fullPath);
  }
};

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style -- avoid circular ref
interface Directory {
  [DirectoryPath: string]: Buffer | Directory | string;
}
