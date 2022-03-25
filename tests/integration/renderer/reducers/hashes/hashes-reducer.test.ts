import type { HashesState } from "@common/utils/hashes-types";
import { setFilesAndFoldersHashes } from "@renderer/reducers/hashes/hashes-actions";
import {
  hashesReducer,
  initialState,
} from "@renderer/reducers/hashes/hashes-reducer";

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

      const baseState: HashesState = {
        ...initialState,
        hashes: {
          [unchangedId]: unchangedHash,
        },
      };

      const nextState = hashesReducer(
        baseState,
        setFilesAndFoldersHashes(newHashes)
      );

      expect(nextState).toEqual({
        ...initialState,
        hashes: {
          [changedId]: newHash,
          [unchangedId]: unchangedHash,
        },
      });
    });
  });
});
