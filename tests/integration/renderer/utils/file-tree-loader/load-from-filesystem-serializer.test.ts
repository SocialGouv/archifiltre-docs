import type { HashesMap } from "@common/utils/hashes-types";
import type { VirtualFileSystem } from "@renderer/files-and-folders-loader/files-and-folders-loader-types";
import type { FilesAndFoldersMap } from "@renderer/reducers/files-and-folders/files-and-folders-types";
import { createFilesAndFoldersMetadata } from "@renderer/reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import type { FilesAndFoldersMetadataMap } from "@renderer/reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  parseVFSFromStream,
  stringifyVFSToStream,
} from "@renderer/utils/file-tree-loader/load-from-filesystem-serializer";
import { times } from "lodash";
import { MockWritable } from "stdio-mock";
import Stream from "stream";

import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";

const extractDataFromMock = async (
  writeable: MockWritable
): Promise<Buffer[]> =>
  new Promise((resolve) => {
    writeable.on("finish", () => {
      resolve(writeable.data());
    });
  });

describe("load-from-filesystem-serializer", () => {
  it("should send and parse a VirtualFileSystem", async () => {
    const filesAndFolders = times(10, (index) =>
      createFilesAndFolders({
        children: index % 2 === 0 ? ["hello"] : [],
        id: `${index}`,
      })
    ).reduce<FilesAndFoldersMap>((acc, element) => {
      acc[element.id] = element;
      return acc;
    }, {});

    const filesAndFoldersMetadata = times(10, () =>
      createFilesAndFoldersMetadata({})
    ).reduce<FilesAndFoldersMetadataMap>((acc, element, index) => {
      acc[`${index}`] = element;
      return acc;
    }, {});

    const hashes = times(10, (index) => `hash-${index}`).reduce<HashesMap>(
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

    stringifyVFSToStream(writeable as any, vfs);

    const data: Buffer[] = await extractDataFromMock(writeable);

    const parsedVfs = await parseVFSFromStream(Stream.Readable.from(data));

    expect(parsedVfs).toEqual(vfs);
  });
});
