import { Field, Message, Type } from "protobufjs";
import {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersMessage } from "util/child-process-stream/child-process-stream-messages";
import { Readable, Writable } from "stream";
import { omit } from "lodash";
import {
  parseSerializedDataFromStream,
  sendStringToStream,
  stringifyObjectToStream,
} from "util/child-process-stream/child-process-stream";
import {
  extractFilesAndFolders,
  extractKey,
  extractKeysFromFilesAndFolders,
  makeDataExtractor,
  OmitProtobuf,
} from "util/child-process-stream/common-serializer";
import { WithFilesAndFolders } from "files-and-folders-loader/files-and-folders-loader-types";
import { Language, WithLanguage } from "util/language/language-types";

export type TreeCsvExporterParams = WithLanguage<WithFilesAndFolders>;

@Type.d("TreeCsvExporterSerializerMessage")
class TreeCsvExporterSerializerMessage extends Message<TreeCsvExporterSerializerMessage> {
  @Field.d(0, "string")
  key: string;

  @Field.d(1, FilesAndFoldersMessage)
  filesAndFolders: FilesAndFolders;
}

const dataSerializer = (
  element: TreeCsvExporterSerializerMessage
): Uint8Array => {
  const message = TreeCsvExporterSerializerMessage.create(element);
  return TreeCsvExporterSerializerMessage.encode(message).finish();
};

export const stringifyTreeCsvExporterOptionsToStream = (
  stream: Writable,
  options: TreeCsvExporterParams
) => {
  const base = omit(options, ["filesAndFolders"]);
  sendStringToStream(stream, JSON.stringify(base));
  stringifyObjectToStream<
    { filesAndFolders: FilesAndFoldersMap },
    OmitProtobuf<TreeCsvExporterSerializerMessage>
  >(stream, options, {
    keyExtractor: extractKeysFromFilesAndFolders,
    dataExtractor: makeDataExtractor(extractKey, extractFilesAndFolders),
    dataSerializer,
  });
  stream.end();
};

const deserializer = (data: Uint8Array) =>
  TreeCsvExporterSerializerMessage.toObject(
    TreeCsvExporterSerializerMessage.decode(data),
    { arrays: true }
  );

const merger = (
  base: TreeCsvExporterParams,
  deserializedData: { key: string; filesAndFolders: FilesAndFolders }
) => {
  const { key, filesAndFolders } = deserializedData;
  base.filesAndFolders[key] = filesAndFolders;
};

export const parseTreeCsvExporterOptionsFromStream = (
  stream: Readable
): Promise<TreeCsvExporterParams> => {
  const options: TreeCsvExporterParams = {
    filesAndFolders: {},
    language: Language.FR,
  };

  return parseSerializedDataFromStream(stream, options, {
    withJsonInitializing: true,
    deserializer,
    merger,
  });
};
