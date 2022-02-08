import * as fs from "fs";
import { compose, map } from "lodash/fp";
import type { TFunction } from "react-i18next";
import { encode } from "windows-1252";

import type { ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import { getElementsToDeleteFromStore } from "../../reducers/files-and-folders/files-and-folders-selectors";
import type { StoreState } from "../../reducers/store";
import { getWorkspaceMetadataFromStore } from "../../reducers/workspace-metadata/workspace-metadata-selectors";
import { translations } from "../../translations/translations";
import { generateDeletionScript } from "../../util/deletion-script/deletion-script-util";
import { startPathFromOneLevelAbove } from "../../util/file-system/file-sys-util";
import { showInFolder } from "../../util/file-system/file-system-util";
import { removeChildrenPath } from "../../util/files-and-folders/file-and-folders-utils";
import type { AnyFunction, Awaitable } from "../../util/function/function-util";
import {
  NotificationDuration,
  notifySuccess,
} from "../../util/notification/notifications-util";
import { isWindows } from "../../util/os/os-util";
import { liftPromise } from "../../util/promise/promise-util";

const prepareElementsToDelete = compose(
  map(startPathFromOneLevelAbove),
  removeChildrenPath,
  getElementsToDeleteFromStore
);

const windowsFileWriter = (path: string): Awaitable<AnyFunction> =>
  compose(
    async (binaryString: string) =>
      fs.promises.writeFile(path, binaryString, "binary"),
    encode as Awaitable<AnyFunction>
  );

const unixFileWriter = (path: string) => async (data: string) =>
  fs.promises.writeFile(path, data);

const getFileWriter = () => (isWindows() ? windowsFileWriter : unixFileWriter);

const curriedWriteFile = getFileWriter();

const extractParamsFromState = (state: StoreState) => ({
  elementsToDelete: prepareElementsToDelete(state),
  originalPath: getWorkspaceMetadataFromStore(state).originalPath,
});

const success = (t: TFunction, filePath: string) => () => {
  notifySuccess(
    t("export.deletionScriptSuccessMessage"),
    t("export.deletionScript"),
    NotificationDuration.NORMAL,
    async () => showInFolder(filePath)
  );
};

export const deletionScriptExporterThunk =
  (filePath: string): ArchifiltreDocsThunkAction =>
  async (dispatch, getState) => {
    return compose(
      liftPromise(success(translations.t.bind(translations), filePath)),
      curriedWriteFile(filePath),
      ({ originalPath, elementsToDelete }) =>
        generateDeletionScript(originalPath, elementsToDelete),
      extractParamsFromState
    )(getState());
  };
