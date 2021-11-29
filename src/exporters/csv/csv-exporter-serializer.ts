import type { GenerateCsvExportOptions } from "exporters/csv/csv-exporter.controller";
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
import type { WithLanguage } from "util/language/language-types";
import { Language } from "util/language/language-types";

@Type.d("CsvExporterSerializerMessage")
export class CsvExporterSerializerMessage extends Message<CsvExporterSerializerMessage> {
    @Field.d(0, "string")
    key: string;

    @Field.d(1, FilesAndFoldersMessage)
    filesAndFolders: FilesAndFolders;

    @Field.d(2, FilesAndFoldersMetadataMessage)
    filesAndFoldersMetadata: FilesAndFoldersMetadata;

    @Field.d(3, "string", "optional")
    hash: string | null;
}

const dataSerializer = (element: CsvExporterSerializerMessage): Uint8Array => {
    const message = CsvExporterSerializerMessage.create(element);
    return CsvExporterSerializerMessage.encode(message).finish();
};

export const stringifyCsvExporterOptionsToStream = (
    stream: Writable,
    options: WithLanguage<GenerateCsvExportOptions>
) => {
    const base = omit(options, [
        "filesAndFolders",
        "filesAndFoldersMetadata",
        "hashes",
    ]);
    sendStringToStream(stream, JSON.stringify(base));
    stringifyObjectToStream<
        WithLanguage<GenerateCsvExportOptions>,
        OmitProtobuf<CsvExporterSerializerMessage>
    >(stream, options, {
        dataExtractor: makeDataExtractor(
            extractKey,
            extractFilesAndFolders,
            extractFilesAndFoldersMetadata,
            extractHashes
        ),
        dataSerializer,
        keyExtractor: extractKeysFromFilesAndFolders,
    });
    stream.end();
};

const deserializer = (data: Uint8Array) =>
    CsvExporterSerializerMessage.toObject(
        CsvExporterSerializerMessage.decode(data),
        { arrays: true }
    );

const merger = (
    base: WithLanguage<GenerateCsvExportOptions>,
    deserializedData: CsvExporterSerializerMessage
) => {
    const { key, filesAndFolders, filesAndFoldersMetadata, hash } =
        deserializedData;
    base.filesAndFolders[key] = filesAndFolders;
    base.filesAndFoldersMetadata[key] = filesAndFoldersMetadata;
    if (hash) {
        base.hashes
            ? (base.hashes[key] = hash)
            : (base.hashes = { [key]: hash });
    }
};

export const parseCsvExporterOptionsFromStream = async (
    stream: Readable
): Promise<WithLanguage<GenerateCsvExportOptions>> => {
    const options: WithLanguage<GenerateCsvExportOptions> = {
        aliases: {},
        comments: {},
        elementsToDelete: [],
        filesAndFolders: {},
        filesAndFoldersMetadata: {},
        language: Language.FR,
        tags: {},
    };

    return parseSerializedDataFromStream(stream, options, {
        deserializer,
        merger,
        withJsonInitializing: true,
    });
};
