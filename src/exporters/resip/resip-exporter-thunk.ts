import { promises as fs } from "fs";
import { takeLast, tap } from "rxjs/operators";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getFilesAndFoldersFromStore,
  getElementsToDeleteFromStore,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { getTagsFromStore } from "reducers/tags/tags-selectors";
import translations from "translations/translations";
import { arrayToCsv } from "util/csv/csv-util";
import {
  notifyInfo,
  notifySuccess,
} from "util/notification/notifications-util";
import { generateResipExport$ } from "./resip-export.controller";
import {
  completeLoadingAction,
  progressLoadingAction,
  startLoadingAction,
} from "reducers/loading-info/loading-info-actions";
import { v4 as uuid } from "uuid";
import { LoadingInfoTypes } from "reducers/loading-info/loading-info-types";
import { RESIP_HOOK_CALL_PER_ELEMENT } from "exporters/resip/resip-exporter";

const resipExportTitle = translations.t("export.resipExportTitle");
const resipExportSuccessMessage = translations.t(
  "export.resipExportSuccessMessage"
);
const resipExportStartedMessage = translations.t(
  "export.resipExportStartedMessage"
);

/**
 * Thunk to export data to Resip
 * @param filePath - name of the output file
 */
export const resipExporterThunk = (
  filePath: string
): ArchifiltreThunkAction => async (dispatch, getState) => {
  const state = getState();
  const tags = getTagsFromStore(state);
  const filesAndFolders = getFilesAndFoldersFromStore(state);
  const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(state);
  const aliases = getAliasesFromStore(state);
  const comments = getCommentsFromStore(state);
  const elementsToDelete = getElementsToDeleteFromStore(state);

  notifyInfo(resipExportStartedMessage, resipExportTitle);
  const loadingActionId = uuid();
  dispatch(
    startLoadingAction(
      loadingActionId,
      LoadingInfoTypes.EXPORT,
      // We remove the root folder
      RESIP_HOOK_CALL_PER_ELEMENT * (Object.keys(filesAndFolders).length - 1),
      "RESIP"
    )
  );

  let lastCount = 0;

  const { resipCsv } = await generateResipExport$({
    aliases,
    comments,
    elementsToDelete,
    filesAndFolders,
    filesAndFoldersMetadata,
    tags,
  })
    .pipe(
      tap(({ count }) => {
        dispatch(progressLoadingAction(loadingActionId, count - lastCount));
        lastCount = count;
      })
    )
    .pipe(takeLast(1))
    .toPromise();

  await fs.writeFile(filePath, arrayToCsv(resipCsv));

  notifySuccess(resipExportSuccessMessage, resipExportTitle);
  dispatch(completeLoadingAction(loadingActionId));
};
