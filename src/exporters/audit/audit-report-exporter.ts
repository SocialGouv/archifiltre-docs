import fs from "fs";
import type { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import {
    getElementsToDeleteFromStore,
    getFileCount,
    getFilesAndFoldersFromStore,
    getFoldersCount,
    getMaxDepth,
} from "reducers/files-and-folders/files-and-folders-selectors";
import type { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import type { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { getHashesFromStore } from "reducers/hashes/hashes-selectors";
import type { HashesMap } from "reducers/hashes/hashes-types";
import translations from "translations/translations";
import {
    countDuplicateFiles,
    countDuplicateFolders,
} from "util/duplicates/duplicates-util";
import {
    formatPathForUserSystem,
    octet2HumanReadableFormat,
} from "util/file-system/file-sys-util";
import { openExternalElement } from "util/file-system/file-system-util";
import { FileType } from "util/file-types/file-types-util";
import {
    NotificationDuration,
    notifyInfo,
    notifySuccess,
} from "util/notification/notifications-util";

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
        depth: getMaxDepth(filesAndFolders),
        longestPathFileName: longestPathFile?.name || "",
        longestPathLength: longestPathFile?.id?.length || 0,
        longestPathPath: formatPathForUserSystem(longestPathFile?.id) || "",
        newestDate: formatAuditReportDate(
            filesAndFoldersMetadata[ROOT_ID].maxLastModified
        ),
        oldestDate: formatAuditReportDate(
            filesAndFoldersMetadata[ROOT_ID].minLastModified
        ),
        presentationCount: fileTypesCounts[FileType.PRESENTATION],
        totalFilesCount: getFileCount(filesAndFolders),
        presentationFileTypes: extensionsList[FileType.PRESENTATION],
        totalFoldersCount: getFoldersCount(filesAndFolders),
        presentationPercent: fileTypesPercents[FileType.PRESENTATION],
        totalSize: octet2HumanReadableFormat(
            filesAndFoldersMetadata[ROOT_ID].childrenTotalSize
        ),
        emailCount: fileTypesCounts[FileType.EMAIL],
        documentPercent: fileTypesPercents[FileType.DOCUMENT],
        publicationCount: fileTypesCounts[FileType.PUBLICATION],
        documentCount: fileTypesCounts[FileType.DOCUMENT],
        publicationFileTypes: extensionsList[FileType.PUBLICATION],
        documentFileTypes: extensionsList[FileType.DOCUMENT],
        publicationPercent: fileTypesPercents[FileType.PUBLICATION],
        emailFileTypes: extensionsList[FileType.EMAIL],
        emailPercent: fileTypesPercents[FileType.EMAIL],
        spreadsheetCount: fileTypesCounts[FileType.SPREADSHEET],
        audioPercent: fileTypesPercents[FileType.AUDIO],
        spreadsheetFileTypes: extensionsList[FileType.SPREADSHEET],
        audioCount: fileTypesCounts[FileType.AUDIO],
        spreadsheetPercent: fileTypesPercents[FileType.SPREADSHEET],
        audioFileTypes: extensionsList[FileType.AUDIO],
        imageCount: fileTypesCounts[FileType.IMAGE],
        imageFileTypes: extensionsList[FileType.IMAGE],
        biggestFiles: getBiggestFiles(filesAndFolders),
        imagePercent: fileTypesPercents[FileType.IMAGE],
        duplicateFileCount: countDuplicateFiles(
            filesAndFolders,
            filesAndFoldersHashes
        ),
        oldestFiles: getOldestFiles(filesAndFolders),
        duplicateFilePercent: getDuplicateFilesPercent(
            filesAndFolders,
            filesAndFoldersHashes
        ),
        videoCount: fileTypesCounts[FileType.VIDEO],
        biggestDuplicateFolders: getDuplicatesWithTheBiggestSize(
            filesAndFolders,
            filesAndFoldersMetadata,
            filesAndFoldersHashes
        ),
        videoPercent: fileTypesPercents[FileType.VIDEO],
        duplicateFolderCount: countDuplicateFolders(
            filesAndFolders,
            filesAndFoldersHashes
        ),
        videoFileTypes: extensionsList[FileType.VIDEO],
        duplicateFolderPercent: getDuplicateFoldersPercent(
            filesAndFolders,
            filesAndFoldersHashes
        ),
        otherCount: fileTypesCounts[FileType.OTHER],
        duplicateTotalSize: getHumanReadableDuplicateTotalSize(
            filesAndFolders,
            filesAndFoldersHashes
        ),
        otherPercent: fileTypesPercents[FileType.OTHER],
        duplicates: getDuplicatesWithTheMostCopy(
            filesAndFolders,
            filesAndFoldersHashes
        ),
        otherFileTypes: "les types restants",
        elementsToDelete: getElementsToDelete(
            filesAndFolders,
            filesAndFoldersMetadata,
            elementsToDelete
        ),
    };
};

/**
 * Thunk to export an audit
 * @param name - name of the output file
 */
export const auditReportExporterThunk =
    (name: string): ArchifiltreThunkAction =>
    async (dispatch, getState): Promise<void> => {
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
            () => openExternalElement(name)
        );
    };
