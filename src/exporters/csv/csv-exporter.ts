import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getFilesAndFoldersFromStore,
  getHashesFromStore
} from "reducers/files-and-folders/files-and-folders-selectors";
import { last } from "rxjs/operators";
import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import { ArchifiltreThunkAction } from "../../reducers/archifiltre-types";
import { getTagsFromStore } from "../../reducers/tags/tags-selectors";
import translations from "../../translations/translations";
import { save, UTF8 } from "../../util/file-sys-util";
import { notifyInfo } from "../../util/notifications-util";
import {
  generateCsvExport$,
  GenerateCsvExportOptions
} from "./csv-exporter.controller";

/**
 * Thunk that generates the csv array for the CSV export with the first line being
 * the csv header.
 * Each line represents one file or folder.
 */
export const csvExporterThunk = (
  name: string,
  { withHashes = false } = {}
): ArchifiltreThunkAction => (dispatch, getState) =>
  new Promise(resolve => {
    addTracker({
      title: ActionTitle.CSV_EXPORT,
      type: ActionType.TRACK_EVENT
    });

    const csvExportStartedMessage = translations.t(
      "export.csvExportStartedMessage"
    );
    const csvExportTitle = translations.t("export.csvExportTitle");
    notifyInfo(csvExportStartedMessage, csvExportTitle);

    const state = getState();
    const tags = getTagsFromStore(state);
    const filesAndFolders = getFilesAndFoldersFromStore(state);
    const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(state);
    const hashes = getHashesFromStore(state);

    const data: GenerateCsvExportOptions = {
      filesAndFolders,
      filesAndFoldersMetadata,
      hashes: undefined,
      tags
    };

    if (withHashes) {
      data.hashes = hashes;
    }
    const csvExportData$ = generateCsvExport$(data);
    csvExportData$.pipe(last()).subscribe({
      next: (csv: string) => {
        save(name, csv, { format: UTF8 });
        resolve();
      }
    });
  });
