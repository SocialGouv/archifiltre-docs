import { times } from "lodash";
import { createFilesAndFolders } from "files-and-folders-loader/files-and-folders-loader";
import { VirtualFileSystem } from "files-and-folders-loader/files-and-folders-loader-types";
import { MockWritable } from "stdio-mock";
import Stream from "stream";
import {
  parseVFSFromStream,
  stringifyVFSToStream,
} from "util/file-tree-loader/load-from-filesystem-serializer";
import { createFilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";

const extractDataFromMock = (writeable: MockWritable): Promise<Buffer[]> =>
  new Promise((resolve) => {
    writeable.on("finish", () => {
      resolve(writeable.data());
    });
  });

describe("load-from-filesystem-serializer", () => {
  it("should send and parse a VirtualFileSystem", async () => {
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
});
