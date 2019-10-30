import { promises as fs } from "fs";
import pick from "languages";
import { takeLast, tap } from "rxjs/operators";
import { toStr } from "../csv";
import { ArchifiltreThunkAction } from "../reducers/archifiltre-types";
import { getFilesAndFoldersFromStore } from "../reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "../reducers/tags/tags-selectors";
import { notifyInfo, notifySuccess } from "../util/notifications-util";
import { makeSIP } from "./mets/mets";
import { generateResipExport$ } from "./resip/resipExport.controller";

const resipExportSuccessMessage = pick({
  en: "The metadata file has been exported to project root folder",
  fr: "Fichier de métadonnées exporté dans le dossier racine du projet"
});

const resipExportTitle = pick({
  en: "Resip Export",
  fr: "Export Resip"
});

const resipExportStartedMessage = pick({
  en: "Resip export started",
  fr: "L'export Resip a commencé"
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

  notifyInfo(resipExportStartedMessage, resipExportTitle);
  return new Promise(resolve => {
    generateResipExport$(filesAndFolders, tags)
      .pipe(takeLast(1))
      .subscribe(async ({ resipCsv }) => {
        await fs.writeFile(filePath, toStr(resipCsv));
        notifySuccess(resipExportSuccessMessage, resipExportTitle);
        resolve();
      });
  });
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
