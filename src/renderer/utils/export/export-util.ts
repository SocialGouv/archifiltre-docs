import { filterResults } from "@common/utils/batch-process/batch-process-util";
import type {
  ErrorMessage,
  ResultMessage,
} from "@common/utils/batch-process/batch-process-util-types";
import { openExternalElement } from "@common/utils/file-system/file-system-util";
import {
  NotificationDuration,
  notifySuccess,
} from "@common/utils/notification/notifications-util";
import { promises as fs } from "fs";
import type { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import type { ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import {
  completeLoadingAction,
  progressLoadingAction,
} from "../../reducers/loading-info/loading-info-actions";
import { startLoading } from "../../reducers/loading-info/loading-info-operations";
import { LoadingInfoTypes } from "../../reducers/loading-info/loading-info-types";

interface ExportOptions {
  totalProgress: number;
  loaderMessage: string;
  loadedMessage: string;
  exportFileName: string;
  exportNotificationTitle: string;
  exportSuccessMessage: string;
}

export const isProgressResult = ({ result }: ResultMessage): boolean =>
  typeof result === "number";

export const handleFileExportThunk =
  (
    exportData$: Observable<ErrorMessage | ResultMessage>,
    {
      totalProgress,
      loaderMessage,
      loadedMessage,
      exportNotificationTitle,
      exportFileName,
      exportSuccessMessage,
    }: ExportOptions
  ): ArchifiltreDocsThunkAction =>
  async (dispatch) => {
    const loadingId: string = dispatch(
      startLoading(
        LoadingInfoTypes.EXPORT,
        totalProgress,
        loaderMessage,
        loadedMessage
      )
    );

    const { result } = await exportData$
      .pipe(
        filterResults(),
        tap((message) => {
          if (isProgressResult(message)) {
            dispatch(
              progressLoadingAction(loadingId, message.result as number)
            );
          }
        })
      )
      .toPromise();

    dispatch(completeLoadingAction(loadingId));
    await fs.writeFile(exportFileName, result as string, {
      encoding: "utf-8",
    });
    notifySuccess(
      exportSuccessMessage,
      exportNotificationTitle,
      NotificationDuration.NORMAL,
      async () => openExternalElement(exportFileName)
    );
  };
