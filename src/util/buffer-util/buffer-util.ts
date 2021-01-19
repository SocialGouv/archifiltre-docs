const numberToUint8Array = (num: number) => {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return new Uint8Array(b);
};

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

export const bufferMessageWithLength = (message: Uint8Array) => {
  const bufferLengthArrayBuffer = numberToUint8Array(message.length);
  return joinBuffers(bufferLengthArrayBuffer, message);
};

export const uint8ArrayToString = (message: Uint8Array) =>
  Buffer.from(message.buffer).toString();

export const readBufferMessageWithLength = (
  message: Uint8Array,
  offset = 0
) => {
  const messageSize = new DataView(message.buffer).getUint32(offset);
  const endIndex = offset + 4 + messageSize;
  const content = message.slice(offset + 4, offset + 4 + messageSize);

  return { content, endIndex };
};

export const readBufferedMessages = (message: Uint8Array) => {
  const bufferSize = message.length;
  let currentOffset = 0;

  const messages: Uint8Array[] = [];
  let previousOffset = 0;

  while (currentOffset < bufferSize && bufferSize - currentOffset >= 4) {
    const { endIndex, content } = readBufferMessageWithLength(
      message,
      currentOffset
    );
    previousOffset = currentOffset;
    currentOffset = endIndex;
    messages.push(content);
  }

  const isBufferOverloaded = currentOffset > bufferSize;

  return {
    messages: isBufferOverloaded ? messages.slice(0, -1) : messages,
    rest: isBufferOverloaded ? message.slice(previousOffset) : null,
  };
};
