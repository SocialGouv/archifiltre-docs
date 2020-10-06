import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { generateExcelExport$ } from "exporters/excel/excel-exporter-controller";
import { getCsvExportParamsFromStore } from "util/array-export/array-export-utils";
import { filterResults } from "util/batch-process/batch-process-util";
import { promises as fs } from "fs";
import { startLoading } from "reducers/loading-info/loading-info-operations";
import { LoadingInfoTypes } from "reducers/loading-info/loading-info-types";
import translations from "translations/translations";
import { tap } from "rxjs/operators";
import {
  completeLoadingAction,
  progressLoadingAction,
} from "reducers/loading-info/loading-info-actions";
import {
  NotificationDuration,
  notifyInfo,
  notifySuccess,
} from "util/notification/notifications-util";
import { openExternalElement } from "util/file-system/file-system-util";
import { getExcelExportProgressGoal } from "exporters/excel/excel-exporter.impl";

export const excelExporterThunk = (
  name: string
): ArchifiltreThunkAction => async (dispatch, getState) => {
  const exportData = getCsvExportParamsFromStore(getState());

  const loadingLabel = translations.t("export.excelExportProgressLabel");

  const elementsCount = Object.keys(exportData.filesAndFolders).length;

  notifyInfo(
    translations.t("export.excelExportStartedMessage"),
    translations.t("export.excelExportTitle")
  );

  const loadingId = dispatch(
    startLoading(
      LoadingInfoTypes.EXPORT,
      getExcelExportProgressGoal(elementsCount),
      loadingLabel
    )
  );

  const { result } = await generateExcelExport$(exportData)
    .pipe(
      tap(() => {
        dispatch(progressLoadingAction(loadingId, 1));
      }),
      filterResults()
    )
    .toPromise();

  dispatch(completeLoadingAction(loadingId));

  await fs.writeFile(name, result, "binary");

  notifySuccess(
    translations.t("export.excelExportSuccessMessage"),
    translations.t("export.excelExportTitle"),
    NotificationDuration.NORMAL,
    () => openExternalElement(name)
  );
};
