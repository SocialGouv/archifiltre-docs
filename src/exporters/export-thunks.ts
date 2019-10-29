import fs from "fs";
import pick from "languages";
import { toStr } from "../csv";
import { ArchifiltreThunkAction } from "../reducers/archifiltre-types";
import { getFilesAndFoldersFromStore } from "../reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "../reducers/tags/tags-selectors";
import { notifySuccess } from "../util/notifications-util";
import { makeSIP } from "./mets/mets";
import resipExporter from "./resipExporter";

const resipExportSuccessMessage = pick({
  en: "The metadata file has been exported to project root folder",
  fr: "Fichier de métadonnées exporté dans le dossier racine du projet"
});

const resipExportSuccessTitle = pick({
  en: "Resip Export",
  fr: "Export Resip"
});

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
  notifySuccess(resipExportSuccessMessage, resipExportSuccessTitle);
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
