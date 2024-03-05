import type { AnyFunction, Awaitable } from "@common/utils/function";
import { isWindows } from "@common/utils/os";
import { liftPromise } from "@common/utils/promise";
import * as fs from "fs";
import { compose, map } from "lodash/fp";
import type { TFunction } from "react-i18next";
import { encode } from "windows-1252";

import type { ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import { getElementsToDeleteFromStore } from "../../reducers/files-and-folders/files-and-folders-selectors";
import type { StoreState } from "../../reducers/store";
import { getWorkspaceMetadataFromStore } from "../../reducers/workspace-metadata/workspace-metadata-selectors";
import { translations } from "../../translations/translations";
import { generateDeletionScript } from "../../utils/deletion-script";
import { removeChildrenPath } from "../../utils/file-and-folders";
import { startPathFromOneLevelAbove } from "../../utils/file-system/file-sys-util";
import { showInFolder } from "../../utils/file-system/file-system-util";
import { NotificationDuration, notifySuccess } from "../../utils/notifications";

const prepareElementsToDelete = compose(
  map(startPathFromOneLevelAbove),
  removeChildrenPath,
  getElementsToDeleteFromStore
);

const windowsFileWriter = (path: string): Awaitable<AnyFunction> =>
  compose(
    async (binaryString: string) =>
      fs.promises.writeFile(path, binaryString, "binary"),
    encode as AnyFunction
  ); // TODO: types

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
  async (_, getState) =>
    compose(
      liftPromise(success(translations.t.bind(translations), filePath)),
      curriedWriteFile(filePath),
      ({ originalPath, elementsToDelete }) =>
        generateDeletionScript(originalPath, elementsToDelete),
      extractParamsFromState
    )(getState());
