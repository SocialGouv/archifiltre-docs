import { VirtualFileSystem } from "files-and-folders-loader/files-and-folders-loader-types";
import { createFilesAndFolders } from "files-and-folders-loader/files-and-folders-loader";
import { createFilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-test-utils";
import {
  folderHashComputerInputToStream,
  parseFolderHashComputerInputFromStream,
  parseVFSFromStream,
  stringifyVFSToStream,
} from "util/vfs-stream/vfs-stream";
import { MockWritable } from "stdio-mock";
import * as Stream from "stream";
import { times } from "lodash";

const extractDataFromMock = (writeable: MockWritable): Promise<Buffer[]> =>
  new Promise((resolve) => {
    writeable.on("finish", () => {
      resolve(writeable.data());
    });
  });

describe("vfs-stream", () => {
  it("should parse sent vfs", async () => {
    const filesAndFolders = times(10, (index) =>
      createFilesAndFolders({
        id: `${index}`,
        children: index % 2 === 0 ? ["hello"] : [],
      })
    ).reduce((acc, element) => {
      acc[element.id] = element;
      return acc;
    }, {});

    const filesAndFoldersMetadata = times(10, () =>
      createFilesAndFoldersMetadata({})
    ).reduce((acc, element, index) => {
      acc[`${index}`] = element;
      return acc;
    }, {});

    const hashes = times(10, (index) => `hash-${index}`).reduce(
      (acc, element, index) => {
        acc[`${index}`] = element;
        return acc;
      },
      {}
    );

    const vfs: VirtualFileSystem = {
      aliases: {},
      comments: {},
      elementsToDelete: [],
      filesAndFolders,
      filesAndFoldersMetadata,
      hashes,
      isOnFileSystem: true,
      originalPath: "path",
      overrideLastModified: {},
      sessionName: "session-name",
      tags: {},
      version: "3.1.1",
      virtualPathToIdMap: {},
    };

    const writeable = new MockWritable();

    // @ts-ignore
    stringifyVFSToStream(writeable, vfs);

    const data: Buffer[] = await extractDataFromMock(writeable);

    const parsedVfs = await parseVFSFromStream(Stream.Readable.from(data));

    expect(parsedVfs).toEqual(vfs);
  });

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
