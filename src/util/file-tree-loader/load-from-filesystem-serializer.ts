import type { VirtualFileSystem } from "files-and-folders-loader/files-and-folders-loader-types";
import { omit } from "lodash";
import { Field, Message, Type } from "protobufjs";
import type { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { Readable, Writable } from "stream";
import {
    parseSerializedDataFromStream,
    sendStringToStream,
    stringifyObjectToStream,
} from "util/child-process-stream/child-process-stream";
import {
    FilesAndFoldersMessage,
    FilesAndFoldersMetadataMessage,
} from "util/child-process-stream/child-process-stream-messages";
import type { OmitProtobuf } from "util/child-process-stream/common-serializer";
import {
    extractFilesAndFolders,
    extractFilesAndFoldersMetadata,
    extractHashes,
    extractKey,
    extractKeysFromFilesAndFolders,
    makeDataExtractor,
} from "util/child-process-stream/common-serializer";

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
    public filesAndFolders: FilesAndFolders;

    @Field.d(3, FilesAndFoldersMetadataMessage)
    public filesAndFoldersMetadata: FilesAndFoldersMetadata;

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
    stringifyObjectToStream<VirtualFileSystem, OmitProtobuf<VFSElementMessage>>(
        stream,
        vfs,
        {
            dataExtractor: makeDataExtractor(
                extractKey,
                extractFilesAndFolders,
                extractFilesAndFoldersMetadata,
                extractHashes
            ),
            dataSerializer: serializeField,
            keyExtractor: extractKeysFromFilesAndFolders,
        }
    );
    stream.end();
};

export const parseVFSFromStream = async (
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
        deserializer: (data: Uint8Array) =>
            VFSElementMessage.toObject(VFSElementMessage.decode(data), {
                arrays: true,
            }),
        merger: (vfs, deserializedData) => {
            const { filesAndFolders, filesAndFoldersMetadata, hash, key } =
                deserializedData;
            vfs.filesAndFolders[key] = filesAndFolders;
            vfs.filesAndFoldersMetadata[key] = filesAndFoldersMetadata;
            if (hash !== "") {
                vfs.hashes[key] = hash;
            }
        },
        withJsonInitializing: true,
    });
};
