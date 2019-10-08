import { ArchifiltreThunkAction } from "../reducers/archifiltre-types";
import { getTagsFromStore } from "../reducers/tags/tags-selectors";
import { makeSIP } from "./mets";
import resipExporter from "./resipExporter";

/**
 * Thunk to export data to Resip
 * @param filesAndFolders - Files and folders as JS object
 */
export const resipExporterThunk = (
  filesAndFolders: any
): ArchifiltreThunkAction => (dispatch, getState) => {
  const tags = getTagsFromStore(getState());

  return resipExporter(filesAndFolders, tags);
};

/**
 * Thunk to export to METS
 * @param state - The application state as ImmutableJS Record
 */
export const exportMetsThunk = (state: any): ArchifiltreThunkAction => (
  dispatch,
  getState
) => {
  const tags = getTagsFromStore(getState());

  makeSIP(state, tags);
};
