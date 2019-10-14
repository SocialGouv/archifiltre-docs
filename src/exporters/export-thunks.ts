import { toStr } from "../csv";
import { ArchifiltreThunkAction } from "../reducers/archifiltre-types";
import { getFilesAndFoldersFromStore } from "../reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "../reducers/tags/tags-selectors";
import { save } from "../util/file-sys-util";
import { makeSIP } from "./mets";
import resipExporter from "./resipExporter";

/**
 * Thunk to export data to Resip
 * @param name - name of the output file
 */
export const resipExporterThunk = (name: string): ArchifiltreThunkAction => (
  dispatch,
  getState
) => {
  const state = getState();
  const tags = getTagsFromStore(state);
  const filesAndFolders = getFilesAndFoldersFromStore(state);
  save(name, toStr(resipExporter(filesAndFolders, tags)));
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
