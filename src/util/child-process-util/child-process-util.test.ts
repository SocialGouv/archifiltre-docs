import path from "path";
import { runCommand } from "util/child-process-util/child-process-util";

describe("child-process-util", () => {
  describe("runCommand", () => {
    it("should handle success", async () => {
      const result = await runCommand("ls", [__dirname]);

      expect(result).toEqual(
        ["child-process-util.test.ts", "child-process-util.ts", ""].join("\n")
      );
    });

    it("should handle errors", async () => {
      const unknownPath = path.join(__dirname, "inexistant-folder");
      const result = runCommand("ls", [unknownPath]);

      await expect(result).rejects.toEqual({
        code: 1,
        message: `ls: ${unknownPath}: No such file or directory\n`,
      });
    });
  });
});
