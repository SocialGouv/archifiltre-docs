import {
  bufferMessageWithLength,
  joinBuffers,
  MESSAGE_SIZE_CHUNK_LENGTH,
  readBufferMessageWithLength,
  uint8ArrayToString,
} from "@common/utils/buffer";

describe("buffer-util", () => {
  describe("readBufferMessageWithLength", () => {
    it("should split buffered messages", () => {
      const message1 = "hello1";
      const message2 = "hello22";
      const message1Buffer = bufferMessageWithLength(Buffer.from(message1));
      const message2Buffer = bufferMessageWithLength(Buffer.from(message2));

      const response = readBufferMessageWithLength(
        joinBuffers(message1Buffer, message2Buffer)
      );

      expect(uint8ArrayToString(response.content)).toEqual(message1);
      expect(response.endIndex).toEqual(
        Buffer.from(message1).length + MESSAGE_SIZE_CHUNK_LENGTH
      );
    });
  });
});
