import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getFilesAndFoldersFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import { toStr } from "../csv";
import * as FilesAndFolders from "../datastore/files-and-folders";
import * as Tags from "../datastore/tags";
import { ArchifiltreThunkAction } from "../reducers/archifiltre-types";
import { getTagsFromStore } from "../reducers/tags/tags-selectors";
import { save } from "../util/file-sys-util";

/**
 * Thunk that generates the csv array for the CSV export with the first line being
 * the csv header.
 * Each line represents one file or folder.
 */
export const csvExporterThunk = (name: string): ArchifiltreThunkAction => (
  dispatch,
  getState
) => {
  const state = getState();
  const tags = getTagsFromStore(state);
  const filesAndFolders = getFilesAndFoldersFromStore(state);
  const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(state);

  const csv = FilesAndFolders.toStrList2(
    filesAndFolders,
    filesAndFoldersMetadata
  );

  Tags.toStrList2(filesAndFolders, tags).map((filesAndFolder, index) =>
    csv[index].concat(filesAndFolder)
  );

  save(name, toStr(csv), {
    format: "utf-8"
  });
};
