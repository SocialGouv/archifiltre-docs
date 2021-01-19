import {
  bufferMessageWithLength,
  joinBuffers,
  readBufferedMessages,
  readBufferMessageWithLength,
  uint8ArrayToString,
} from "util/buffer-util/buffer-util";
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
      expect(response.endIndex).toEqual(Buffer.from(message1).length + 4);
    });
  });

  describe("readBufferedMessages", () => {
    it("should return all the Uint8Array split", () => {
      const message1 = "hello1";
      const message2 = "hello22";
      const message1Buffer = bufferMessageWithLength(Buffer.from(message1));
      const message2Buffer = bufferMessageWithLength(Buffer.from(message2));

      const response = readBufferedMessages(
        joinBuffers(message1Buffer, message2Buffer)
      );

      expect(
        response.messages.map((element) => uint8ArrayToString(element))
      ).toEqual([message1, message2]);
    });
  });
});
