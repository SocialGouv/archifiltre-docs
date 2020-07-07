import {asyncLoadFilesAndFoldersFromFileSystem} from "./files-and-folders-loader";
import {empty} from "../util/function/function-util";

describe("fezf", () => {
  it("djkfre", async () => {
    const result = await asyncLoadFilesAndFoldersFromFileSystem("D:\\dev\\incub\\ArchifiltreSampleFolder", empty);
    console.log(result.length);
  });
});
