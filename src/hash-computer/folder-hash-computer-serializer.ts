import { Readable, Writable } from "stream";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersMessage } from "util/child-process-stream/child-process-stream-messages";
import { WithFilesAndFolders } from "util/virtual-file-system-util/virtual-file-system-util";
import { WithHashes } from "files-and-folders-loader/files-and-folders-loader-types";
import {
  parseSerializedDataFromStream,
  stringifyObjectToStream,
} from "util/child-process-stream/child-process-stream";
import { Field, Message, Type } from "protobufjs";

@Type.d("FolderHashComputerInput")
class FolderHashComputerInputMessage extends Message<FolderHashComputerInputMessage> {
  @Field.d(1, "string")
  public key: string;

  @Field.d(2, FilesAndFoldersMessage)
  public filesAndFolders: FilesAndFoldersMessage;

  @Field.d(3, "string")
  public hash: string | null;
}

type FolderHashComputerData = WithFilesAndFolders & WithHashes;

type FolderHashComputerSerializedData = {
  key: string;
  filesAndFolders: FilesAndFolders;
  hash: string | null;
};

export const folderHashComputerInputToStream = (
  stream: Writable,
  data: FolderHashComputerData
) => {
  stringifyObjectToStream<
    FolderHashComputerData,
    FolderHashComputerSerializedData
  >(stream, data, {
    keyExtractor: (inputData) => Object.keys(inputData.filesAndFolders),
    dataExtractor: (
      inputData,
      key
    ): {
      key: string;
      filesAndFolders: FilesAndFolders;
      hash: string | null;
    } => ({
      key,
      filesAndFolders: inputData.filesAndFolders[key],
      hash: inputData.hashes[key],
    }),
    dataSerializer: (dataToSerialize) => {
      const message = FolderHashComputerInputMessage.create(dataToSerialize);
      return FolderHashComputerInputMessage.encode(message).finish();
    },
  });
  stream.end();
};

export const parseFolderHashComputerInputFromStream = (stream: Readable) => {
  const base: WithFilesAndFolders & WithHashes = {
    filesAndFolders: {},
    hashes: {},
  };

  return parseSerializedDataFromStream(stream, base, {
    deserializer: (data: Uint8Array) =>
      FolderHashComputerInputMessage.toObject(
        FolderHashComputerInputMessage.decode(data),
        {
          arrays: true,
        }
      ),
    merger: (outputData, deserializedData) => {
      const { key, hash, filesAndFolders } = deserializedData;
      outputData.filesAndFolders[key] = filesAndFolders;
      outputData.hashes[key] = hash;
    },
  });
};
