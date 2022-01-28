const UINT_32_BYTE_SIZE = 4;

// The message length is encoded as a 32 bits unsigned int
export const MESSAGE_SIZE_CHUNK_LENGTH = UINT_32_BYTE_SIZE;

/**
 * Transforms a javascript Unsigned int to a Uint8array
 */
const numberToUint8Array = (num: number) => {
  const buffer = new ArrayBuffer(UINT_32_BYTE_SIZE);
  new DataView(buffer).setUint32(0, num);
  return new Uint8Array(buffer);
};

/**
 * Utility to concatenate Uint8Array
 */
export const joinBuffers = (...buffers: Uint8Array[]): Uint8Array => {
  const positions = buffers.reduce<number[]>(
    (acc, buffer, index) => [...acc, (acc[index - 1] || 0) + buffer.length],
    []
  );
  const totalLength = positions[positions.length - 1];

  const joinedBuffer = new Uint8Array(totalLength);

  buffers.forEach((buffer, index) => {
    joinedBuffer.set(buffer, positions[index - 1] || 0);
  });

  return joinedBuffer;
};

/**
 * Prepend the buffer size as an Uint32 to a buffer
 */
export const bufferMessageWithLength = (message: Uint8Array): Uint8Array => {
  const bufferLengthArrayBuffer = numberToUint8Array(message.length);
  return joinBuffers(bufferLengthArrayBuffer, message);
};

/**
 * Transform an Uint8 array into a string
 */
export const uint8ArrayToString = (message: Uint8Array): string =>
  Buffer.from(message.buffer).toString();

/**
 * Reads the message with length starting at offset from the buffer
 */
export const readBufferMessageWithLength = (
  message: Uint8Array,
  offset = 0
): {
  content: Uint8Array;
  endIndex: number;
} => {
  const messageSize = new DataView(message.buffer).getUint32(offset);
  const endIndex = offset + MESSAGE_SIZE_CHUNK_LENGTH + messageSize;
  const content = message.slice(offset + 4, offset + 4 + messageSize);

  return { content, endIndex };
};
