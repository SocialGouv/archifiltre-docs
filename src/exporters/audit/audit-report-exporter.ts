import fs from "fs";

import type { ArchifiltreDocsThunkAction } from "../../reducers/archifiltre-types";
import {
  getElementsToDeleteFromStore,
  getFileCount,
  getFilesAndFoldersFromStore,
  getFoldersCount,
  getMaxDepth,
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import type { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import type { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { getHashesFromStore } from "../../reducers/hashes/hashes-selectors";
import type { HashesMap } from "../../reducers/hashes/hashes-types";
import { translations } from "../../translations/translations";
import {
  countDuplicateFiles,
  countDuplicateFolders,
} from "../../util/duplicates/duplicates-util";
import {
  formatPathForUserSystem,
  octet2HumanReadableFormat,
} from "../../util/file-system/file-sys-util";
import { openExternalElement } from "../../util/file-system/file-system-util";
import { FileType } from "../../util/file-types/file-types-util";
import type { AnyFunction } from "../../util/function/function-util";
import {
  NotificationDuration,
  notifyInfo,
  notifySuccess,
} from "../../util/notification/notifications-util";
import type { AuditReportData } from "./audit-report-generator";
import { generateAuditReportDocx } from "./audit-report-generator";
import {
  countFileTypes,
  formatAuditReportDate,
  getBiggestFiles,
  getDuplicateFilesPercent,
  getDuplicateFoldersPercent,
  getDuplicatesWithTheBiggestSize,
  getDuplicatesWithTheMostCopy,
  getElementsToDelete,
  getExtensionsList,
  getHumanReadableDuplicateTotalSize,
  getLongestPathFile,
  getOldestFiles,
  percentFileTypes,
} from "./audit-report-values-computer";

const ROOT_ID = "";

export const computeAuditReportData = (
  filesAndFolders: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap,
  filesAndFoldersHashes: HashesMap,
  elementsToDelete: string[]
): AuditReportData => {
  const longestPathFile = getLongestPathFile(filesAndFolders);
  const fileTypesPercents = percentFileTypes(filesAndFolders);
  const fileTypesCounts = countFileTypes(filesAndFolders);
  const extensionsList = getExtensionsList();
  return {
    audioCount: fileTypesCounts[FileType.AUDIO],
    audioFileTypes: extensionsList[FileType.AUDIO],
    audioPercent: fileTypesPercents[FileType.AUDIO],
    biggestDuplicateFolders: getDuplicatesWithTheBiggestSize(
      filesAndFolders,
      filesAndFoldersMetadata,
      filesAndFoldersHashes
    ),
    biggestFiles: getBiggestFiles(filesAndFolders),
    depth: getMaxDepth(filesAndFolders),
    documentCount: fileTypesCounts[FileType.DOCUMENT],
    documentFileTypes: extensionsList[FileType.DOCUMENT],
    documentPercent: fileTypesPercents[FileType.DOCUMENT],
    duplicateFileCount: countDuplicateFiles(
      filesAndFolders,
      filesAndFoldersHashes
    ),
    duplicateFilePercent: getDuplicateFilesPercent(
      filesAndFolders,
      filesAndFoldersHashes
    ),
    duplicateFolderCount: countDuplicateFolders(
      filesAndFolders,
      filesAndFoldersHashes
    ),
    duplicateFolderPercent: getDuplicateFoldersPercent(
      filesAndFolders,
      filesAndFoldersHashes
    ),
    duplicateTotalSize: getHumanReadableDuplicateTotalSize(
      filesAndFolders,
      filesAndFoldersHashes
    ),
    duplicates: getDuplicatesWithTheMostCopy(
      filesAndFolders,
      filesAndFoldersHashes
    ),
    elementsToDelete: getElementsToDelete(
      filesAndFolders,
      filesAndFoldersMetadata,
      elementsToDelete
    ),
    emailCount: fileTypesCounts[FileType.EMAIL],
    emailFileTypes: extensionsList[FileType.EMAIL],
    emailPercent: fileTypesPercents[FileType.EMAIL],
    imageCount: fileTypesCounts[FileType.IMAGE],
    imageFileTypes: extensionsList[FileType.IMAGE],
    imagePercent: fileTypesPercents[FileType.IMAGE],
    longestPathFileName: longestPathFile?.name ?? "",
    longestPathLength: longestPathFile?.id.length ?? 0,
    longestPathPath: longestPathFile?.id
      ? formatPathForUserSystem(longestPathFile.id)
      : "",
    newestDate: formatAuditReportDate(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      filesAndFoldersMetadata[ROOT_ID].maxLastModified ?? 0
    ),
    oldestDate: formatAuditReportDate(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      filesAndFoldersMetadata[ROOT_ID].minLastModified ?? 0
    ),
    oldestFiles: getOldestFiles(filesAndFolders),
    otherCount: fileTypesCounts[FileType.OTHER],
    otherFileTypes: "les types restants",
    otherPercent: fileTypesPercents[FileType.OTHER],
    presentationCount: fileTypesCounts[FileType.PRESENTATION],
    presentationFileTypes: extensionsList[FileType.PRESENTATION],
    presentationPercent: fileTypesPercents[FileType.PRESENTATION],
    publicationCount: fileTypesCounts[FileType.PUBLICATION],
    publicationFileTypes: extensionsList[FileType.PUBLICATION],
    publicationPercent: fileTypesPercents[FileType.PUBLICATION],
    spreadsheetCount: fileTypesCounts[FileType.SPREADSHEET],
    spreadsheetFileTypes: extensionsList[FileType.SPREADSHEET],
    spreadsheetPercent: fileTypesPercents[FileType.SPREADSHEET],
    totalFilesCount: getFileCount(filesAndFolders),
    totalFoldersCount: getFoldersCount(filesAndFolders),
    totalSize: octet2HumanReadableFormat(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      filesAndFoldersMetadata[ROOT_ID].childrenTotalSize ?? 0
    ),
    videoCount: fileTypesCounts[FileType.VIDEO],
    videoFileTypes: extensionsList[FileType.VIDEO],
    videoPercent: fileTypesPercents[FileType.VIDEO],
  };
};

/**
 * Thunk to export an audit
 * @param name - name of the output file
 */
export const auditReportExporterThunk =
  (name: string): ArchifiltreDocsThunkAction =>
  async (_dispatch: AnyFunction, getState): Promise<void> => {
    notifyInfo(
      translations.t("export.auditReportStarted"),
      translations.t("export.auditReportTitle")
    );
    await new Promise((resolve) => setTimeout(resolve, 500));

    const filesAndFolders = getFilesAndFoldersFromStore(getState());
    const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(
      getState()
    );
    const hashes = getHashesFromStore(getState());
    const elementsToDelete = getElementsToDeleteFromStore(getState());

    await fs.promises.writeFile(
      name,
      generateAuditReportDocx(
        computeAuditReportData(
          filesAndFolders,
          filesAndFoldersMetadata,
          hashes,
          elementsToDelete
        )
      )
    );

    notifySuccess(
      translations.t("export.auditReportSuccess"),
      translations.t("export.auditReportTitle"),
      NotificationDuration.NORMAL,
      async () => openExternalElement(name)
    );
  };
