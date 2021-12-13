import fs from "fs";

import type { SimpleObject } from "../object/object-util";

interface BufferedFileWriter {
    write: (obj: SimpleObject) => void;
}

/**
 * Returns a buffered writer that will append objects to a file in the write order
 * @param filename
 */
export const createBufferedFileWriter = (
    filename: string
): BufferedFileWriter => {
    const buffer: SimpleObject[] = [];
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
        void writeToFile();
    };

    const write = (obj: SimpleObject) => {
        buffer.push(obj);
        void writeToFile();
    };

    return {
        write,
    };
};
