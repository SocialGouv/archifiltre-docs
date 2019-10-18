import fs from "fs";
import { toStr } from "../csv";
import { ArchifiltreThunkAction } from "../reducers/archifiltre-types";
import { getFilesAndFoldersFromStore } from "../reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "../reducers/tags/tags-selectors";
import { formatFileContentForResip } from "../util/file-format-util";
import { save } from "../util/file-sys-util";
import { makeSIP } from "./mets";
import resipExporter from "./resipExporter";

/**
 * Thunk to export data to Resip
 * @param filePath - name of the output file
 */
export const resipExporterThunk = (
  filePath: string
): ArchifiltreThunkAction => (dispatch, getState) => {
  const state = getState();
  const tags = getTagsFromStore(state);
  const filesAndFolders = getFilesAndFoldersFromStore(state);
  const content = toStr(resipExporter(filesAndFolders, tags));

  fs.writeFileSync(filePath, content);
};

/**
 * Thunk to export to METS
 * @param state - The application state as ImmutableJS Record
 */
export const metsExporterThunk = (state: any): ArchifiltreThunkAction => (
  dispatch,
  getState
) => {
  const tags = getTagsFromStore(getState());

  makeSIP(state, tags);
};
