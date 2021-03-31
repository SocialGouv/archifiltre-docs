import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { generateDeletionScript } from "util/deletion-script/deletion-script-util";
import { compose, map } from "lodash/fp";
import { getWorkspaceMetadataFromStore } from "reducers/workspace-metadata/workspace-metadata-selectors";
import { getElementsToDeleteFromStore } from "reducers/files-and-folders/files-and-folders-selectors";
import { removeChildrenPath } from "util/files-and-folders/file-and-folders-utils";
import { startPathFromOneLevelAbove } from "util/file-system/file-sys-util";
import * as fs from "fs";
import { StoreState } from "reducers/store";
import { liftPromise } from "util/promise/promise-util";
import {
  NotificationDuration,
  notifySuccess,
} from "util/notification/notifications-util";
import { TFunction } from "react-i18next";
import translations from "translations/translations";
import { showInFolder } from "util/file-system/file-system-util";

const prepareElementsToDelete = compose(
  map(startPathFromOneLevelAbove),
  removeChildrenPath,
  getElementsToDeleteFromStore
);

const curriedWriteFile = (filePath: string) => (data: string) =>
  fs.promises.writeFile(filePath, data);

const extractParamsFromState = (state: StoreState) => ({
  originalPath: getWorkspaceMetadataFromStore(state).originalPath,
  elementsToDelete: prepareElementsToDelete(state),
});

const success = (t: TFunction, filePath: string) => () =>
  notifySuccess(
    t("export.deletionScriptSuccessMessage"),
    t("export.deletionScript"),
    NotificationDuration.NORMAL,
    () => showInFolder(filePath)
  );

export const deletionScriptExporterThunk = (
  filePath: string
): ArchifiltreThunkAction => (dispatch, getState) =>
  compose(
    liftPromise(success(translations.t.bind(translations), filePath)),
    curriedWriteFile(filePath),
    ({ originalPath, elementsToDelete }) =>
      generateDeletionScript(originalPath, elementsToDelete),
    extractParamsFromState
  )(getState());
