import { Field, Message, Type } from "protobufjs";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import {
  FilesAndFoldersMessage,
  FilesAndFoldersMetadataMessage,
} from "util/child-process-stream/child-process-stream-messages";
import { FilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { WithFilesAndFolders } from "util/virtual-file-system-util/virtual-file-system-util";
import { GenerateCsvExportOptions } from "exporters/csv/csv-exporter.controller";
import { Readable, Writable } from "stream";
import { omit } from "lodash";
import {
  parseSerializedDataFromStream,
  sendStringToStream,
  stringifyObjectToStream,
} from "util/child-process-stream/child-process-stream";
import { Language, WithLanguage } from "hooks/use-language";

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

const keyExtractor = (data: WithFilesAndFolders) =>
  Object.keys(data.filesAndFolders);

const dataExtractor = (
  {
    filesAndFolders,
    filesAndFoldersMetadata,
    hashes,
  }: GenerateCsvExportOptions,
  key: string
) => ({
  key,
  filesAndFolders: filesAndFolders[key],
  filesAndFoldersMetadata: filesAndFoldersMetadata[key],
  hash: (hashes && hashes[key]) || null,
});

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
  stringifyObjectToStream(stream, options, {
    keyExtractor,
    dataExtractor,
    dataSerializer,
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
  const {
    key,
    filesAndFolders,
    filesAndFoldersMetadata,
    hash,
  } = deserializedData;
  base.filesAndFolders[key] = filesAndFolders;
  base.filesAndFoldersMetadata[key] = filesAndFoldersMetadata;
  if (hash) {
    base.hashes ? (base.hashes[key] = hash) : (base.hashes = { [key]: hash });
  }
};

export const parseCsvExporterOptionsFromStream = (
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
    withJsonInitializing: true,
    deserializer,
    merger,
  });
};
