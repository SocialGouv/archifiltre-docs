import {
  VirtualFileSystem,
  WithHashes,
} from "files-and-folders-loader/files-and-folders-loader-types";
import { Readable, Transform, Writable } from "stream";
import { omit } from "lodash";
import {
  bufferMessageWithLength,
  joinBuffers,
  readBufferMessageWithLength,
  uint8ArrayToString,
} from "util/buffer-util/buffer-util";
import {
  FolderHashComputerInput,
  VFSElementMessage,
} from "util/vfs-stream/vfs-stream-messages";
import { createTimer } from "debug/debug";
import { FilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { WithFilesAndFolders } from "util/virtual-file-system-util/virtual-file-system-util";

export const serializeField = (element: {
  hash: string | null;
  key: string;
  filesAndFolders: FilesAndFolders;
  filesAndFoldersMetadata: FilesAndFoldersMetadata;
}): Uint8Array => {
  const message = VFSElementMessage.create(element);
  return VFSElementMessage.encode(message).finish();
};

const sendBufferToStream = (stream: Writable, buffer: Uint8Array) => {
  stream.write(bufferMessageWithLength(buffer));
};

const sendStringToStream = (stream: Writable, data: string) => {
  const arrayBuffer = new Uint8Array(Buffer.from(data));
  sendBufferToStream(stream, arrayBuffer);
};

type StringifyObjectToStreamOptions<Data, SerializedData> = {
  keyExtractor: (data: Data) => string[];
  dataExtractor: (data: Data, key: string) => SerializedData;
  dataSerializer: (data: SerializedData) => Uint8Array;
};

export const stringifyObjectToStream = <Data, SerializedData>(
  stream: Writable,
  data: Data,
  {
    keyExtractor,
    dataExtractor,
    dataSerializer,
  }: StringifyObjectToStreamOptions<Data, SerializedData>
) => {
  let sentSize = 0;
  keyExtractor(data).forEach((elementKey) => {
    const serializedData = dataSerializer(dataExtractor(data, elementKey));
    sendBufferToStream(stream, serializedData);
    sentSize += serializedData.length;
  });
  console.log(sentSize);
};

export type MessageSerializer<Data> = (stream: Writable, data: Data) => void;

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
      const message = FolderHashComputerInput.create(dataToSerialize);
      return FolderHashComputerInput.encode(message).finish();
    },
  });
  stream.end();
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

const sections: (keyof VirtualFileSystem)[] = [
  "filesAndFolders",
  "filesAndFoldersMetadata",
  "hashes",
];

const writeTimer = createTimer();
const readTimer = createTimer();

class MessageDeserializer extends Transform {
  static MESSAGE_LENGTH_SIZE = 4;

  private queue: Uint8Array = new Uint8Array();
  constructor() {
    super({
      objectMode: true,
    });
  }
  _write(
    chunk: Buffer,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
    writeTimer.start();
    this.queue = this.queue
      ? joinBuffers(this.queue, new Uint8Array(chunk))
      : new Uint8Array(chunk);
    writeTimer.stop();
    this._read();

    callback();
  }

  _flush(callback) {
    this._read();
    callback();
  }

  private getMessageLength() {
    return new DataView(this.queue.buffer).getUint32(0);
  }

  private canRead() {
    return (
      this.queue &&
      this.queue.length >= MessageDeserializer.MESSAGE_LENGTH_SIZE &&
      this.getMessageLength() + MessageDeserializer.MESSAGE_LENGTH_SIZE <=
        this.queue.length
    );
  }

  _read() {
    if (this.canRead()) {
      readTimer.start();
      const { content, endIndex } = readBufferMessageWithLength(this.queue);
      this.push(content);
      this.queue = this.queue.slice(endIndex);
      readTimer.stop();
      this._read();
    }
  }
}

const deserializingTimer = createTimer();

type ParseSerializedDataFromStreamOptions<OutputData, DeserializedData> = {
  withJsonInitializing?: boolean;
  deserializer: (data: Uint8Array) => DeserializedData;
  merger: (outputData: OutputData, deserializedData: DeserializedData) => void;
};
export const parseSerializedDataFromStream = <OutputData, DeserializedData>(
  stream: Readable,
  initialData: OutputData,
  {
    withJsonInitializing = false,
    deserializer,
    merger,
  }: ParseSerializedDataFromStreamOptions<OutputData, DeserializedData>
): Promise<OutputData> => {
  const outputData = { ...initialData };
  let isFirstMessage = true;

  const parseBinaryMessage = (message: Uint8Array) => {
    const stringMessage = uint8ArrayToString(message);

    if (withJsonInitializing && isFirstMessage && message.length > 0) {
      const baseData = JSON.parse(stringMessage);
      Object.assign(outputData, baseData);
      isFirstMessage = false;
    } else {
      deserializingTimer.start();
      const deserializedData = deserializer(message);
      merger(outputData, deserializedData);
      deserializingTimer.stop();
    }
  };

  return new Promise((resolve) => {
    const deserializer = new MessageDeserializer();
    stream.pipe(deserializer);
    deserializer.on("readable", () => {
      deserializer.resume();
      let data;
      do {
        data = deserializer.read();
        if (data !== null) {
          parseBinaryMessage(data);
        }
      } while (data !== null);
    });

    deserializer.on("end", () => {
      console.log("read", readTimer.getTime());
      console.log("write", writeTimer.getTime());
      console.log("deserial", deserializingTimer.getTime());
      resolve(outputData);
    });
  });
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

export const parseFolderHashComputerInputFromStream = (stream: Readable) => {
  const base: WithFilesAndFolders & WithHashes = {
    filesAndFolders: {},
    hashes: {},
  };

  return parseSerializedDataFromStream(stream, base, {
    deserializer: (data: Uint8Array) =>
      FolderHashComputerInput.toObject(FolderHashComputerInput.decode(data), {
        arrays: true,
      }),
    merger: (outputData, deserializedData) => {
      const { key, hash, filesAndFolders } = deserializedData;
      outputData.filesAndFolders[key] = filesAndFolders;
      outputData.hashes[key] = hash;
    },
  });
};
