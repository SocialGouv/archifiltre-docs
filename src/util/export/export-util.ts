import { promises as fs } from "fs";
import type { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import type { ArchifiltreThunkAction } from "../../reducers/archifiltre-types";
import {
    completeLoadingAction,
    progressLoadingAction,
} from "../../reducers/loading-info/loading-info-actions";
import { startLoading } from "../../reducers/loading-info/loading-info-operations";
import { LoadingInfoTypes } from "../../reducers/loading-info/loading-info-types";
import { filterResults } from "../../util/batch-process/batch-process-util";
import type {
    ErrorMessage,
    ResultMessage,
} from "../../util/batch-process/batch-process-util-types";
import { openExternalElement } from "../../util/file-system/file-system-util";
import {
    NotificationDuration,
    notifySuccess,
} from "../../util/notification/notifications-util";

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
    ): ArchifiltreThunkAction =>
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
                            progressLoadingAction(
                                loadingId,
                                message.result as number
                            )
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
