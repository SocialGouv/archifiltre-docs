import { omit } from "lodash";
import { Field, Message, Type } from "protobufjs";
import type { Readable, Writable } from "stream";

import type { WithFilesAndFolders } from "../../files-and-folders-loader/files-and-folders-loader-types";
import type {
  FilesAndFolders,
  FilesAndFoldersMap,
} from "../../reducers/files-and-folders/files-and-folders-types";
import {
  parseSerializedDataFromStream,
  sendStringToStream,
  stringifyObjectToStream,
} from "../../utils/child-process-stream";
import { FilesAndFoldersMessage } from "../../utils/child-process-stream/child-process-stream-messages";
import type { OmitProtobuf } from "../../utils/child-process-stream/common-serializer";
import {
  extractFilesAndFolders,
  extractKey,
  extractKeysFromFilesAndFolders,
  makeDataExtractor,
} from "../../utils/child-process-stream/common-serializer";
import type { WithLanguage } from "../../utils/language/types";
import { Language } from "../../utils/language/types";

export type TreeCsvExporterParams = WithLanguage<WithFilesAndFolders>;

@Type.d("TreeCsvExporterSerializerMessage")
class TreeCsvExporterSerializerMessage extends Message<TreeCsvExporterSerializerMessage> {
  @Field.d(0, "string")
  key!: string;

  @Field.d(1, FilesAndFoldersMessage)
  filesAndFolders!: FilesAndFolders;
}

const dataSerializer = (
  element: OmitProtobuf<TreeCsvExporterSerializerMessage>
): Uint8Array => {
  const message = TreeCsvExporterSerializerMessage.create(element);
  return TreeCsvExporterSerializerMessage.encode(message).finish();
};

export const stringifyTreeCsvExporterOptionsToStream = (
  stream: Writable,
  options: TreeCsvExporterParams
): void => {
  const base = omit(options, ["filesAndFolders"]);
  sendStringToStream(stream, JSON.stringify(base));
  stringifyObjectToStream<
    { filesAndFolders: FilesAndFoldersMap },
    OmitProtobuf<TreeCsvExporterSerializerMessage>
  >(stream, options, {
    dataExtractor: makeDataExtractor(extractKey, extractFilesAndFolders),
    dataSerializer,
    keyExtractor: extractKeysFromFilesAndFolders,
  });
  stream.end();
};

const deserializer = (data: Uint8Array) =>
  TreeCsvExporterSerializerMessage.toObject(
    TreeCsvExporterSerializerMessage.decode(data),
    { arrays: true }
  ) as { filesAndFolders: FilesAndFolders; key: string };

const merger = (
  base: TreeCsvExporterParams,
  deserializedData: { filesAndFolders: FilesAndFolders; key: string }
) => {
  const { key, filesAndFolders } = deserializedData;
  base.filesAndFolders[key] = filesAndFolders;
};

export const parseTreeCsvExporterOptionsFromStream = async (
  stream: Readable
): Promise<TreeCsvExporterParams> => {
  const options: TreeCsvExporterParams = {
    filesAndFolders: {},
    language: Language.FR,
  };

  return parseSerializedDataFromStream(stream, options, {
    deserializer,
    merger,
    withJsonInitializing: true,
  });
};
