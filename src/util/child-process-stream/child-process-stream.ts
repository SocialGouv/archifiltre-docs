import { Readable, Transform, Writable } from "stream";
import {
  bufferMessageWithLength,
  joinBuffers,
  MESSAGE_SIZE_CHUNK_LENGTH,
  readBufferMessageWithLength,
  uint8ArrayToString,
} from "util/buffer-util/buffer-util";

const sendBufferToStream = (stream: Writable, buffer: Uint8Array) => {
  stream.write(bufferMessageWithLength(buffer));
};

/**
 * Sends a string to a binary stream. Adds 4 bytes at the start to specify the length
 * of the message.
 * @param stream
 * @param data
 */
export const sendStringToStream = (stream: Writable, data: string) => {
  const arrayBuffer = new Uint8Array(Buffer.from(data));
  sendBufferToStream(stream, arrayBuffer);
};

type StringifyObjectToStreamOptions<Data, SerializedData> = {
  keyExtractor: (data: Data) => string[];
  dataExtractor: (data: Data, key: string) => SerializedData;
  dataSerializer: (data: SerializedData) => Uint8Array;
};

/**
 * Writes an object to a binary stream
 * @param stream
 * @param data
 * @param keyExtractor - returns keys to iterate on the object.
 * @param dataExtractor - builds the object to serialize based on the provided key
 * @param dataSerializer - serialize the extracted object to an Uint8 array
 */
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
  _write(
    chunk: Buffer,
    encoding: string,
    callback: (error?: Error | null) => void
  ) {
    this.queue = joinBuffers(this.queue, new Uint8Array(chunk));
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
      this.queue.length >= MESSAGE_SIZE_CHUNK_LENGTH &&
      this.getMessageLength() + MESSAGE_SIZE_CHUNK_LENGTH <= this.queue.length
    );
  }

  _read() {
    if (this.canRead()) {
      const { content, endIndex } = readBufferMessageWithLength(this.queue);
      this.push(content);
      this.queue = this.queue.slice(endIndex);
      this._read();
    }
  }
}

type ParseSerializedDataFromStreamOptions<OutputData, DeserializedData> = {
  withJsonInitializing?: boolean;
  deserializer: (data: Uint8Array) => DeserializedData;
  merger: (outputData: OutputData, deserializedData: DeserializedData) => void;
};

/**
 * Deserialize data send to a stream using stringifyObjectToStream
 * @param stream
 * @param initialData - The data initial state
 * @param withJsonInitializing - define if the stream will include a JSON message providing initial data
 * @param deserializer - Transform the binary data into an object
 * @param merger - Merge the deserialized object into the result object. It uses side effects for performance concerns
 */
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
      const deserializedData = deserializer(message);
      merger(outputData, deserializedData);
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
      resolve(outputData);
    });
  });
};
