import { promises as fs } from "fs";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import {
  completeLoadingAction,
  progressLoadingAction,
} from "reducers/loading-info/loading-info-actions";
import { startLoading } from "reducers/loading-info/loading-info-operations";
import { LoadingInfoTypes } from "reducers/loading-info/loading-info-types";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import {
  NotificationDuration,
  notifySuccess,
} from "util/notification/notifications-util";
import { openExternalElement } from "util/file-system/file-system-util";
import { filterResults } from "util/batch-process/batch-process-util";
import { ResultMessage } from "util/batch-process/batch-process-util-types";

type ExportOptions = {
  totalProgress: number;
  loaderMessage: string;
  exportFileName: string;
  exportNotificationTitle: string;
  exportSuccessMessage: string;
};

export const isProgressResult = ({ result }: ResultMessage): boolean =>
  typeof result === "number";

export const handleFileExportThunk = (
  exportData$: Observable<any>,
  {
    totalProgress,
    loaderMessage,
    exportNotificationTitle,
    exportFileName,
    exportSuccessMessage,
  }: ExportOptions
): ArchifiltreThunkAction => async (dispatch) => {
  const loadingId = dispatch(
    startLoading(LoadingInfoTypes.EXPORT, totalProgress, loaderMessage)
  );

  const { result } = await exportData$
    .pipe(
      filterResults(),
      tap((message) => {
        if (isProgressResult(message)) {
          dispatch(progressLoadingAction(loadingId, message.result));
        }
      })
    )
    .toPromise();

  dispatch(completeLoadingAction(loadingId));
  await fs.writeFile(exportFileName, result, { encoding: "utf-8" });
  notifySuccess(
    exportSuccessMessage,
    exportNotificationTitle,
    NotificationDuration.NORMAL,
    () => openExternalElement(exportFileName)
  );
};
