import { VirtualFileSystem } from "files-and-folders-loader/files-and-folders-loader-types";
import { Readable, Transform, Writable } from "stream";
import {
  FilesAndFolders,
  filesAndFoldersKeys,
} from "reducers/files-and-folders/files-and-folders-types";
import { omit, pick } from "lodash";
import {
  bufferMessageWithLength,
  joinBuffers,
  readBufferMessageWithLength,
  uint8ArrayToString,
} from "util/buffer-util/buffer-util";
import { VFSElementMessage } from "util/vfs-stream/vfs-stream-messages";
import {
  FilesAndFoldersMetadata,
  filesAndFoldersMetadataKeys,
} from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { createTimer } from "debug/debug";

export const serializeField = (
  element: FilesAndFolders &
    FilesAndFoldersMetadata & { key: string } & { hash: string | null }
): Uint8Array => {
  const message = VFSElementMessage.create(element);
  return VFSElementMessage.encode(message).finish();
};

export const signalSection = (stream: Writable, sectionName: string) => {
  sendStringToStream(stream, `Section:${sectionName}`);
};

const sendBufferToStream = (stream: Writable, buffer: Uint8Array) => {
  stream.write(bufferMessageWithLength(buffer));
};

const sendStringToStream = (stream: Writable, data: string) => {
  const arrayBuffer = new Uint8Array(Buffer.from(data));
  sendBufferToStream(stream, arrayBuffer);
};

export const stringifyVFSToStream = (
  stream: Writable,
  vfs: VirtualFileSystem
) => {
  let sentSize = 0;
  const base = omit(vfs, sections);
  sendStringToStream(stream, JSON.stringify(base));
  Object.keys(vfs["filesAndFolders"]).forEach((elementKey) => {
    const data = serializeField({
      key: elementKey,
      ...vfs.filesAndFolders[elementKey],
      ...vfs.filesAndFoldersMetadata[elementKey],
      hash: vfs.hashes[elementKey],
    });
    sendBufferToStream(stream, data);
    sentSize += data.length;
  });
  console.log(sentSize);
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

  let isFirstMessage = true;

  const parseBinaryMessage = (message: Uint8Array) => {
    const stringMessage = uint8ArrayToString(message);

    if (isFirstMessage && message.length > 0) {
      const baseData = JSON.parse(stringMessage);
      Object.assign(vfs, baseData);
      isFirstMessage = false;
    } else {
      deserializingTimer.start();
      const buffer = Buffer.from(message.buffer);
      const element = VFSElementMessage.decode(buffer);
      const { key } = element;
      const filesAndFolders = pick(element, filesAndFoldersKeys);
      const filesAndFoldersMetadata = pick(
        element,
        filesAndFoldersMetadataKeys
      );
      vfs.filesAndFolders[key] = filesAndFolders;
      vfs.filesAndFoldersMetadata[key] = filesAndFoldersMetadata;
      if (element.hash !== "") {
        vfs.hashes[key] = element.hash;
      }
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
      resolve(vfs);
    });
  });
};
