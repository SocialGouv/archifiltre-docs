import * as FilesAndFolders from "../datastore/files-and-folders";
import * as Tags from "../datastore/tags";
import { ArchifiltreThunkAction } from "../reducers/archifiltre-types";
import { getTagsFromStore } from "../reducers/tags/tags-selectors";

/**
 * Thunk that generates the csv array for the CSV export with the first line being
 * the csv header.
 * Each line represents one file or folder.
 * ffIdList is an array that determined the line order.
 * @param filesAndFolders - The filesAndFolders Object (immutableJS)
 */
export const generateCsvExportArray = (
  filesAndFolders: any
): ArchifiltreThunkAction => (dispatch, getState): string[][] => {
  const rootId = "";
  const tags = getTagsFromStore(getState());
  const ffIdList = FilesAndFolders.toFfidList(filesAndFolders).filter(
    a => a !== rootId
  );

  const ans = FilesAndFolders.toStrList2(ffIdList, filesAndFolders);

  Tags.toStrList2(ffIdList, filesAndFolders, tags).forEach((a, i) => {
    ans[i] = ans[i].concat(a);
  });

  return ans;
};
