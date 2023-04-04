import {ArchifiltreThunkAction} from "reducers/archifiltre-types";
import translations from "translations/translations";
import {handleFileExportThunk} from "util/export/export-util";
import {notifyInfo} from "util/notification/notifications-util";
import {GenerateCsvExportOptions,} from "./csv-exporter.controller";
import {getCsvExportParamsFromStore} from "util/array-export/array-export-utils";
import {Observable} from "rxjs";
import {exportToCsvWithProgress} from "./csv-exporter.impl";
import {MessageTypes, WorkerMessage} from "../../util/batch-process/batch-process-util-types";

/**
 * Thunk that generates the csv array for the CSV export with the first line being
 * the csv header.
 * Each line represents one file or folder.
 */
export const csvExporterThunk = (
  name: string,
  { withHashes = false } = {}
): ArchifiltreThunkAction => async (dispatch, getState) => {
  const csvExportStartedMessage = translations.t(
    "export.csvExportStartedMessage"
  );
  const exportNotificationTitle = translations.t("export.csvExportTitle");
  notifyInfo(csvExportStartedMessage, exportNotificationTitle);

  const exportData = getCsvExportParamsFromStore(getState());

  const data: GenerateCsvExportOptions = {
    ...exportData,
  };

  if (!withHashes) {
    delete data.hashes;
  }

  const totalProgress = Object.keys(exportData.filesAndFolders).length + 1;
  const loaderMessage = withHashes
    ? translations.t("export.creatingCsvExportWithHashes")
    : translations.t("export.creatingCsvExport");

  const exportSuccessMessage = translations.t("export.csvExportSuccessMessage");


  const csvExportData$ = new Observable(
      subscriber => {
          const notify = (message: WorkerMessage) => {
              if (message.type === MessageTypes.COMPLETE) {
                  subscriber.complete()
                  return;
              }
              if (message.type === MessageTypes.RESULT) {
                  subscriber.next(message)
              }
          }

          exportToCsvWithProgress(
              notify,
              data
          )
      }
  )

  return dispatch(
    handleFileExportThunk(csvExportData$, {
      totalProgress,
      loaderMessage,
      exportNotificationTitle,
      exportFileName: name,
      exportSuccessMessage,
    })
  );
};
