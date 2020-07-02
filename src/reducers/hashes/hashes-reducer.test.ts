import { setFilesAndFoldersHashes } from "./hashes-actions";
import { HashesState } from "./hashes-types";
import { hashesReducer } from "./hashes-reducer";

describe("hashesReducer", () => {
  describe("SET_FILES_AND_FOLDERS_HASHES", () => {
    it("should add the file and folder alias", () => {
      const changedId = "changed-id";
      const unchangedId = "unchanged-id";
      const newHash = "new-hash";
      const unchangedHash = "unchanged-hash";

      const newHashes = {
        [changedId]: newHash,
      };

      const initialState: HashesState = {
        hashes: {
          [unchangedId]: unchangedHash,
        },
      };

      const nextState = hashesReducer(
        initialState,
        setFilesAndFoldersHashes(newHashes)
      );

      expect(nextState).toEqual({
        hashes: {
          [changedId]: newHash,
          [unchangedId]: unchangedHash,
        },
      });
    });
  });
});
