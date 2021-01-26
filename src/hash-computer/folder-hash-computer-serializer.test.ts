import { MockWritable } from "stdio-mock";
import { createFilesAndFolders } from "files-and-folders-loader/files-and-folders-loader";
import Stream from "stream";
import {
  folderHashComputerInputToStream,
  parseFolderHashComputerInputFromStream,
} from "hash-computer/folder-hash-computer-serializer";

const extractDataFromMock = (writeable: MockWritable): Promise<Buffer[]> =>
  new Promise((resolve) => {
    writeable.on("finish", () => {
      resolve(writeable.data());
    });
  });

describe("folder-hash-computer-serializer", () => {
  it("should send and parse FolderHashComputerInput", async () => {
    const inputData = {
      filesAndFolders: {
        id1: createFilesAndFolders({ id: "id1" }),
        id2: createFilesAndFolders({ id: "id2" }),
      },
      hashes: {
        id1: "id1-hash",
        id2: "id2-hash",
      },
    };

    const writeable = new MockWritable();

    // @ts-ignore
    folderHashComputerInputToStream(writeable, inputData);

    const data = await extractDataFromMock(writeable);

    const parsedData = await parseFolderHashComputerInputFromStream(
      Stream.Readable.from(data)
    );

    expect(parsedData).toEqual(inputData);
  });
});
