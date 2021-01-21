import { Readable, Writable } from "stream";
import { VirtualFileSystem } from "files-and-folders-loader/files-and-folders-loader-types";
import {
  FilesAndFoldersMessage,
  FilesAndFoldersMetadataMessage,
} from "util/child-process-stream/child-process-stream-messages";
import { omit } from "lodash";
import {
  parseSerializedDataFromStream,
  sendStringToStream,
  stringifyObjectToStream,
} from "util/child-process-stream/child-process-stream";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { Field, Message, Type } from "protobufjs";

const sections: (keyof VirtualFileSystem)[] = [
  "filesAndFolders",
  "filesAndFoldersMetadata",
  "hashes",
];

@Type.d("VFSElement")
class VFSElementMessage extends Message<VFSElementMessage> {
  @Field.d(1, "string")
  public key: string;

  @Field.d(2, FilesAndFoldersMessage)
  public filesAndFolders: FilesAndFoldersMessage;

  @Field.d(3, FilesAndFoldersMetadataMessage)
  public filesAndFoldersMetadata: FilesAndFoldersMetadataMessage;

  @Field.d(4, "string")
  public hash: string | null;
}

/**
 * Serialize extracted data to binary using protobuf
 * @param element
 */
export const serializeField = (element: {
  hash: string | null;
  key: string;
  filesAndFolders: FilesAndFolders;
  filesAndFoldersMetadata: FilesAndFoldersMetadata;
}): Uint8Array => {
  const message = VFSElementMessage.create(element);
  return VFSElementMessage.encode(message).finish();
};

export const stringifyVFSToStream = (
  stream: Writable,
  vfs: VirtualFileSystem
) => {
  const base = omit(vfs, sections);
  sendStringToStream(stream, JSON.stringify(base));
  stringifyObjectToStream(stream, vfs, {
    keyExtractor: (virtualFileSystem) =>
      Object.keys(virtualFileSystem.filesAndFolders),
    dataExtractor: (virtualFileSystem, elementKey) => ({
      key: elementKey,
      filesAndFolders: vfs.filesAndFolders[elementKey],
      filesAndFoldersMetadata: vfs.filesAndFoldersMetadata[elementKey],
      hash: vfs.hashes[elementKey],
    }),
    dataSerializer: serializeField,
  });
  stream.end();
};

export const parseVFSFromStream = (
  stream: Readable
): Promise<VirtualFileSystem> => {
  const vfs: VirtualFileSystem = {
    aliases: {},
    comments: {},
    elementsToDelete: [],
    filesAndFolders: {},
    filesAndFoldersMetadata: {},
    hashes: {},
    isOnFileSystem: true,
    originalPath: "",
    overrideLastModified: {},
    sessionName: "",
    tags: {},
    version: "",
    virtualPathToIdMap: {},
  };

  return parseSerializedDataFromStream(stream, vfs, {
    withJsonInitializing: true,
    deserializer: (data: Uint8Array) =>
      VFSElementMessage.toObject(VFSElementMessage.decode(data), {
        arrays: true,
      }),
    merger: (vfs, deserializedData) => {
      const {
        filesAndFolders,
        filesAndFoldersMetadata,
        hash,
        key,
      } = deserializedData;
      vfs.filesAndFolders[key] = filesAndFolders;
      vfs.filesAndFoldersMetadata[key] = filesAndFoldersMetadata;
      if (hash !== "") {
        vfs.hashes[key] = hash;
      }
    },
  });
};
