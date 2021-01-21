/**
 * Transforms a javascript Unsigned int to a Uint8array
 * @param num
 */
const numberToUint8Array = (num: number) => {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return new Uint8Array(b);
};

/**
 * Utility to concatenate Uint8Array
 * @param buffers
 */
export const joinBuffers = (...buffers: Uint8Array[]) => {
  const positions = buffers.reduce(
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
 * @param message
 */
export const bufferMessageWithLength = (message: Uint8Array) => {
  const bufferLengthArrayBuffer = numberToUint8Array(message.length);
  return joinBuffers(bufferLengthArrayBuffer, message);
};

/**
 * Transform an Uint8 array into a string
 * @param message
 */
export const uint8ArrayToString = (message: Uint8Array) =>
  Buffer.from(message.buffer).toString();

/**
 * Reads the message with length starting at offset from the buffer
 * @param message
 * @param offset
 */
export const readBufferMessageWithLength = (
  message: Uint8Array,
  offset = 0
) => {
  const messageSize = new DataView(message.buffer).getUint32(offset);
  const endIndex = offset + 4 + messageSize;
  const content = message.slice(offset + 4, offset + 4 + messageSize);

  return { content, endIndex };
};
