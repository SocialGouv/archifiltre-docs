import type { HashesMap } from "@common/utils/hashes-types";

import type { ArchifiltreDocsThunkAction } from "../archifiltre-types";
import { setFilesAndFoldersHashes } from "./hashes-actions";

/**
 * Updated multiple fileAndFolders hashes
 * @param hashes
 */
export const updateFilesAndFoldersHashes =
  (hashes: HashesMap): ArchifiltreDocsThunkAction =>
  (dispatch) => {
    dispatch(setFilesAndFoldersHashes(hashes));
  };
