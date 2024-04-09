import {
  bufferMessageWithLength,
  joinBuffers,
  MESSAGE_SIZE_CHUNK_LENGTH,
  readBufferMessageWithLength,
  uint8ArrayToString,
} from "@common/utils/buffer";
import { type Readable, Transform, type TransformCallback, type Writable } from "stream";

const sendBufferToStream = (stream: Writable, buffer: Uint8Array) => {
  stream.write(bufferMessageWithLength(buffer));
};

/**
 * Sends a string to a binary stream. Adds 4 bytes at the start to specify the length
 * of the message.
 * @param stream
 * @param data
 */
export const sendStringToStream = (stream: Writable, data: string): void => {
  const arrayBuffer = new Uint8Array(Buffer.from(data));
  sendBufferToStream(stream, arrayBuffer);
};

interface StringifyObjectToStreamOptions<TData, TSerializedData> {
  dataExtractor: (data: TData, key: string) => TSerializedData;
  dataSerializer: (data: TSerializedData) => Uint8Array;
  keyExtractor: (data: TData) => string[];
}

/**
 * Writes an object to a binary stream
 * @param stream
 * @param data
 * @param keyExtractor - returns keys to iterate on the object.
 * @param dataExtractor - builds the object to serialize based on the provided key
 * @param dataSerializer - serialize the extracted object to an Uint8 array
 */
export const stringifyObjectToStream = <TData, TSerializedData>(
  stream: Writable,
  data: TData,
  { keyExtractor, dataExtractor, dataSerializer }: StringifyObjectToStreamOptions<TData, TSerializedData>,
): void => {
  keyExtractor(data).forEach(elementKey => {
    const serializedData = dataSerializer(dataExtractor(data, elementKey));
    sendBufferToStream(stream, serializedData);
  });
};

export type MessageSerializer<TData> = (stream: Writable, data: TData) => void;

/**
 * A transform stream that allows to separate binary messages sent to a stream
 * using stringifyObjectToStream
 */
class MessageDeserializer extends Transform {
  private queue: Uint8Array = new Uint8Array();

  constructor() {
    super({
      objectMode: true,
    });
  }

  _write(chunk: Buffer, _encoding: string, callback: (error?: Error | null) => void) {
    this.queue = joinBuffers(this.queue, new Uint8Array(chunk));
    this._read();

    callback();
  }

  _flush(callback: TransformCallback) {
    this._read();
    callback();
  }

  _read() {
    if (this.canRead()) {
      const { content, endIndex } = readBufferMessageWithLength(this.queue);
      this.push(content);
      this.queue = this.queue.slice(endIndex);
      this._read();
    }
  }

  private getMessageLength() {
    return new DataView(this.queue.buffer).getUint32(0);
  }

  private canRead() {
    return (
      this.queue.length >= MESSAGE_SIZE_CHUNK_LENGTH &&
      this.getMessageLength() + MESSAGE_SIZE_CHUNK_LENGTH <= this.queue.length
    );
  }
}

interface ParseSerializedDataFromStreamOptions<TOutputData, TDeserializedData> {
  deserializer: (data: Uint8Array) => TDeserializedData;
  merger: (outputData: TOutputData, deserializedData: TDeserializedData) => void;
  withJsonInitializing?: boolean;
}

/**
 * Deserialize data send to a stream using stringifyObjectToStream
 * @param stream
 * @param initialData - The data initial state
 * @param withJsonInitializing - define if the stream will include a JSON message providing initial data
 * @param deserializer - Transform the binary data into an object
 * @param merger - Merge the deserialized object into the result object. It uses side effects for performance concerns
 */
export const parseSerializedDataFromStream = async <TOutputData, TDeserializedData>(
  stream: Readable,
  initialData: TOutputData,
  {
    withJsonInitializing = false,
    deserializer,
    merger,
  }: ParseSerializedDataFromStreamOptions<TOutputData, TDeserializedData>,
): Promise<TOutputData> => {
  const outputData = { ...initialData };
  let isFirstMessage = true;

  const parseBinaryMessage = (message: Uint8Array) => {
    const stringMessage = uint8ArrayToString(message);

    if (withJsonInitializing && isFirstMessage && message.length > 0) {
      const baseData = JSON.parse(stringMessage);
      Object.assign(outputData, baseData);
      isFirstMessage = false;
    } else {
      const deserializedData = deserializer(message);
      merger(outputData, deserializedData);
    }
  };

  return new Promise(resolve => {
    const messageDeserializer = new MessageDeserializer();
    stream.pipe(messageDeserializer);
    messageDeserializer.on("readable", () => {
      messageDeserializer.resume();
      let data: Uint8Array | null = null;
      do {
        data = messageDeserializer.read();
        if (data !== null) {
          parseBinaryMessage(data);
        }
      } while (data !== null);
    });

    messageDeserializer.on("end", () => {
      resolve(outputData);
    });
  });
};
