import { shell } from "electron";
import { promises as fs } from "fs";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import {
  completeLoadingAction,
  progressLoadingAction,
} from "reducers/loading-info/loading-info-actions";
import { startLoading } from "reducers/loading-info/loading-info-operations";
import { LoadingInfoTypes } from "reducers/loading-info/loading-info-types";
import { from, Observable } from "rxjs";
import { bufferTime, mergeMap, tap } from "rxjs/operators";
import {
  NotificationDuration,
  notifySuccess,
} from "util/notification/notifications-util";

type ExportOptions = {
  totalProgress: number;
  loaderMessage: string;
  exportFileName: string;
  exportNotificationTitle: string;
  exportSuccessMessage: string;
};

const LOADING_BAR_UPDATE_INTERVAL = 1000;

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
    .pipe(bufferTime(LOADING_BAR_UPDATE_INTERVAL))
    .pipe(
      tap((buffer) => dispatch(progressLoadingAction(loadingId, buffer.length)))
    )
    .pipe(mergeMap((buffer) => from(buffer)))
    .toPromise();

  dispatch(completeLoadingAction(loadingId));
  await fs.writeFile(exportFileName, result, { encoding: "utf-8" });
  notifySuccess(
    exportSuccessMessage,
    exportNotificationTitle,
    NotificationDuration.NORMAL,
    () => shell.openPath(exportFileName)
  );
};
