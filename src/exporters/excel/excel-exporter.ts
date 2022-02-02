import { promises as fs } from "fs";
import { tap } from "rxjs/operators";

import type { ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import {
  completeLoadingAction,
  progressLoadingAction,
} from "../../reducers/loading-info/loading-info-actions";
import { startLoading } from "../../reducers/loading-info/loading-info-operations";
import { LoadingInfoTypes } from "../../reducers/loading-info/loading-info-types";
import { translations } from "../../translations/translations";
import { getCsvExportParamsFromStore } from "../../util/array-export/array-export-utils";
import { filterResults } from "../../util/batch-process/batch-process-util";
import type { ResultMessage } from "../../util/batch-process/batch-process-util-types";
import { isProgressResult } from "../../util/export/export-util";
import { openExternalElement } from "../../util/file-system/file-system-util";
import {
  NotificationDuration,
  notifyInfo,
  notifySuccess,
} from "../../util/notification/notifications-util";
import { getExcelExportProgressGoal } from "./excel-exporter.impl";
import { generateExcelExport$ } from "./excel-exporter-controller";

export const excelExporterThunk =
  (name: string): ArchifiltreDocsThunkAction =>
  async (dispatch, getState) => {
    const exportData = getCsvExportParamsFromStore(getState());

    const loadingLabel = translations.t("export.excelExportProgressLabel");
    const loadedLabel = translations.t("export.excelExportSuccessMessage");

    const elementsCount = Object.keys(exportData.filesAndFolders).length;

    notifyInfo(
      translations.t("export.excelExportStartedMessage"),
      translations.t("export.excelExportTitle")
    );

    const loadingId = dispatch(
      startLoading(
        LoadingInfoTypes.EXPORT,
        getExcelExportProgressGoal(elementsCount),
        loadingLabel,
        loadedLabel
      )
    );

    const { result } = await generateExcelExport$(exportData)
      .pipe(
        filterResults<number>(),
        tap((message: ResultMessage<number>) => {
          if (isProgressResult(message)) {
            dispatch(progressLoadingAction(loadingId, message.result));
          }
        })
      )
      .toPromise();

    await fs.writeFile(name, String(result), "binary");

    dispatch(completeLoadingAction(loadingId));

    notifySuccess(
      translations.t("export.excelExportSuccessMessage"),
      translations.t("export.excelExportTitle"),
      NotificationDuration.NORMAL,
      async () => openExternalElement(name)
    );
  };
