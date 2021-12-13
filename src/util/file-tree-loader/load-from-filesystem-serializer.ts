import { omit } from "lodash";
import { Field, Message, Type } from "protobufjs";
import type { Readable, Writable } from "stream";

import type { VirtualFileSystem } from "../../files-and-folders-loader/files-and-folders-loader-types";
import type { FilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
    parseSerializedDataFromStream,
    sendStringToStream,
    stringifyObjectToStream,
} from "../child-process-stream/child-process-stream";
import {
    FilesAndFoldersMessage,
    FilesAndFoldersMetadataMessage,
} from "../child-process-stream/child-process-stream-messages";
import type { OmitProtobuf } from "../child-process-stream/common-serializer";
import {
    extractFilesAndFolders,
    extractFilesAndFoldersMetadata,
    extractHashes,
    extractKey,
    extractKeysFromFilesAndFolders,
    makeDataExtractor,
} from "../child-process-stream/common-serializer";

const sections: (keyof VirtualFileSystem)[] = [
    "filesAndFolders",
    "filesAndFoldersMetadata",
    "hashes",
];

/* eslint-disable @typescript-eslint/ban-ts-comment */
@Type.d("VFSElement")
class VFSElementMessage extends Message<VFSElementMessage> {
    @Field.d(1, "string")
    // @ts-expect-error
    public key: string;

    @Field.d(2, FilesAndFoldersMessage)
    // @ts-expect-error
    public filesAndFolders: FilesAndFolders;

    @Field.d(3, FilesAndFoldersMetadataMessage)
    // @ts-expect-error
    public filesAndFoldersMetadata: FilesAndFoldersMetadata;

    @Field.d(4, "string")
    // @ts-expect-error
    public hash: string | null;
}
/* eslint-enable @typescript-eslint/ban-ts-comment */

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
): void => {
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
        merger: (vfsToMerge, deserializedData) => {
            const { filesAndFolders, filesAndFoldersMetadata, hash, key } =
                deserializedData;
            vfsToMerge.filesAndFolders[key] = filesAndFolders;
            vfsToMerge.filesAndFoldersMetadata[key] = filesAndFoldersMetadata;
            if (hash !== "") {
                vfsToMerge.hashes[key] = hash;
            }
        },
        withJsonInitializing: true,
    });
};
