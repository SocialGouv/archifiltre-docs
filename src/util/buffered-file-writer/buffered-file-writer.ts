import fs from "fs";

interface BufferedFileWriter {
  write: (obj: object) => void;
}

/**
 * Returns a buffered writer that will append objects to a file in the write order
 * @param filename
 */
export const createBufferedFileWriter = (
  filename: string
): BufferedFileWriter => {
  const buffer: object[] = [];
  let writing = false;
  fs.writeFileSync(filename, "");

  const writeToFile = async () => {
    if (buffer.length === 0 || writing) {
      return;
    }
    writing = true;
    const elementToWrite = buffer.shift();
    await fs.promises.appendFile(filename, JSON.stringify(elementToWrite));
    writing = false;
    writeToFile();
  };

  const write = (obj: object) => {
    buffer.push(obj);
    writeToFile();
  };

  return {
    write,
  };
};
