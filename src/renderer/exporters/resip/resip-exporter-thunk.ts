import { arrayToCsv } from "@common/utils/csv";
import { promises as fs } from "fs";
import { takeLast, tap } from "rxjs/operators";
import { v4 as uuid } from "uuid";

import { type ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import {
  getAliasesFromStore,
  getCommentsFromStore,
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  completeLoadingAction,
  progressLoadingAction,
  startLoadingAction,
} from "../../reducers/loading-info/loading-info-actions";
import { LoadingInfoTypes } from "../../reducers/loading-info/loading-info-types";
import { getActiveSedaFields, getSedaMetadata } from "../../reducers/seda-configuration/seda-configuration-selector";
import { getTagsFromStore } from "../../reducers/tags/tags-selectors";
import { translations } from "../../translations/translations";
import { notifyInfo, notifySuccess } from "../../utils/notifications";
import { generateResipExport$ } from "./resip-export.controller";
import { RESIP_HOOK_CALL_PER_ELEMENT } from "./resip-exporter";

/**
 * Thunk to export data to Resip
 * @param filePath - name of the output file
 */
export const resipExporterThunk =
  (filePath: string): ArchifiltreDocsThunkAction =>
  async (dispatch, getState) => {
    const state = getState();
    const tags = getTagsFromStore(state);
    const filesAndFolders = getFilesAndFoldersFromStore(state);
    const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(state);
    const aliases = getAliasesFromStore(state);
    const comments = getCommentsFromStore(state);
    const elementsToDelete = getElementsToDeleteFromStore(state);
    const sedaMetadata = getSedaMetadata(state);
    const activeSedaFields = getActiveSedaFields(sedaMetadata);

    const resipExportTitle = translations.t("export.resipExportTitle");
    const resipExportSuccessMessage = translations.t("export.resipExportSuccessMessage");
    const resipExportStartedMessage = translations.t("export.resipExportStartedMessage");

    notifyInfo(resipExportStartedMessage, resipExportTitle);
    const loadingActionId = uuid();
    dispatch(
      startLoadingAction(
        loadingActionId,
        LoadingInfoTypes.EXPORT,
        // We remove the root folder
        RESIP_HOOK_CALL_PER_ELEMENT * (Object.keys(filesAndFolders).length - 1),
        "RESIP",
        resipExportSuccessMessage,
      ),
    );

    let lastCount = 0;

    const { resipCsv } = await generateResipExport$({
      activeSedaFields,
      aliases,
      comments,
      elementsToDelete,
      filesAndFolders,
      filesAndFoldersMetadata,
      sedaMetadata,
      tags,
    })
      .pipe(
        tap(({ count }) => {
          dispatch(progressLoadingAction(loadingActionId, count - lastCount));
          lastCount = count;
        }),
      )
      .pipe(takeLast(1))
      .toPromise();

    await fs.writeFile(filePath, arrayToCsv(resipCsv));

    notifySuccess(resipExportSuccessMessage, resipExportTitle);
    dispatch(completeLoadingAction(loadingActionId));
  };
