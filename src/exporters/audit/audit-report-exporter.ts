import dateFormat from "dateformat";
import path from "path";
import { octet2HumanReadableFormat } from "../../components/ruler";
import { ArchifiltreThunkAction } from "../../reducers/archifiltre-types";
import { getFilesAndFoldersMetadataFromStore } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import {
  getFileCount,
  getFilesAndFoldersFromStore,
  getFoldersCount,
  getMaxDepth
} from "../../reducers/files-and-folders/files-and-folders-selectors";
import { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import { medianOnSortedArray } from "../../util/array-util";
import { exportToDocX } from "../../util/docx-util";
import {
  countDeeperFolders,
  countFoldersWithMoreThanNChildren,
  countLongerPath,
  filesAndFoldersMapToArray,
  findAllFoldersWithNoSubfolder,
  getFolders,
  sortFoldersByChildrenCount,
  sortFoldersByDepth
} from "../../util/file-and-folders-utils";
import { saveBlob } from "../../util/file-sys-util";
import { percent } from "../../util/numbers-util";
import {
  AuditReportData,
  generateAuditReportDocx
} from "./audit-report-generator";
import { getLongestPathFile } from "./audit-report-values-computer";

const CHILDREN_LIMIT = 30;
const NB_FOLDERS_TO_DISPLAY = 10;
const MAX_FOLDERS_DEPTH = 7;
const MAX_PATH_LENGTH = 200;
export const TEMPLATE_PATH = path.join(
  STATIC_ASSETS_PATH,
  "template/auditTemplate.docx"
);

/**
 * Returns a blob containing the docx content for an audit report
 * This is based on the template defined in the const TEMPLATE_PATH
 * @param filesAndFolders - The files and folders list
 * @returns {Blob}
 */
const auditReportExporter = filesAndFolders => {
  const filesAndFoldersArray = filesAndFoldersMapToArray(filesAndFolders);
  const folders = getFolders(filesAndFoldersArray);

  /*
   * Report page 1 data
   */
  const nbFolders = folders.length;
  const nbFoldersWithTooManyChildren = countFoldersWithMoreThanNChildren(
    CHILDREN_LIMIT
  )(folders);
  const nbFoldersWithTooManyChildrenPercent = percent(
    nbFoldersWithTooManyChildren,
    nbFolders
  );

  const sortedFoldersByChildrenCount = sortFoldersByChildrenCount(folders);

  const medianOfChildren = medianOnSortedArray(
    sortedFoldersByChildrenCount.map(folder => folder.children.length)
  );

  const foldersWithMostChildren = sortedFoldersByChildrenCount.slice(
    0,
    NB_FOLDERS_TO_DISPLAY
  );

  /*
   * Report page 2 data
   */
  const foldersWithNoSubfolders = findAllFoldersWithNoSubfolder(
    filesAndFolders
  ).map(folderId => ({ id: folderId, ...filesAndFolders[folderId] }));

  const foldersWithNoSubfoldersByDepth = sortFoldersByDepth(
    foldersWithNoSubfolders
  );

  const nbFoldersTooDeep = countDeeperFolders(MAX_FOLDERS_DEPTH)(
    foldersWithNoSubfolders
  );

  const foldersTooDeepPercent = percent(
    nbFoldersTooDeep,
    foldersWithNoSubfolders.length
  );

  const medianDepth = medianOnSortedArray(
    foldersWithNoSubfoldersByDepth.map(folder => folder.depth)
  );

  /*
   * Report page 3 data
   */
  const nbElements = filesAndFoldersArray.length;

  const pathList = Object.keys(filesAndFolders);

  const orderedPathList = pathList.sort(
    (firstPath, secondPath) => secondPath.length - firstPath.length
  );
  const pathLengthMedian = medianOnSortedArray(
    orderedPathList.map(currentPath => currentPath.length)
  );

  const nbPathTooLong = countLongerPath(MAX_PATH_LENGTH)(pathList);
  const nbPathTooLongPercent = percent(nbPathTooLong, nbElements);

  let docxData = {
    creationDate: dateFormat(new Date(), "dd/mm/yyyy"),
    foldersTooDeepPercent: `${foldersTooDeepPercent}%`,
    medianDepth,
    medianOfChildren,
    nbElements,
    nbFolders,
    nbFoldersTooDeep,
    nbFoldersWithNoSubfolders: foldersWithNoSubfolders.length,
    nbFoldersWithTooManyChildren,
    nbFoldersWithTooManyChildrenPercent: `${nbFoldersWithTooManyChildrenPercent}%`,
    nbPathTooLong,
    nbPathTooLongPercent: `${nbPathTooLongPercent}%`,
    pathLengthMedian
  };

  const foldersWithMostChildrenValues = foldersWithMostChildren.reduce(
    (acc, folder, index) => ({
      ...acc,
      [`largeFolder${index + 1}Path`]: folder.id,
      [`largeFolder${index + 1}Value`]: folder.children.length
    }),
    {}
  );

  const deepestFoldersValues = foldersWithNoSubfoldersByDepth
    .slice(0, NB_FOLDERS_TO_DISPLAY)
    .reduce(
      (acc, folder, index) => ({
        ...acc,
        [`deepFolder${index + 1}Path`]: folder.id,
        [`deepFolder${index + 1}Value`]: folder.depth
      }),
      {}
    );

  const longestPathValues = orderedPathList
    .slice(0, NB_FOLDERS_TO_DISPLAY)
    .reduce(
      (acc, currentPath, index) => ({
        ...acc,
        [`longPath${index + 1}Path`]: currentPath,
        [`longPath${index + 1}Value`]: currentPath.length
      }),
      {}
    );

  docxData = {
    ...docxData,
    ...foldersWithMostChildrenValues,
    ...deepestFoldersValues,
    ...longestPathValues
  };

  return exportToDocX(TEMPLATE_PATH, docxData);
};

const ROOT_ID = "";

const formatAuditReportDate = (timestamp: number): string =>
  dateFormat(timestamp, "dd/mm/yyyy");

// tslint:disable:object-literal-sort-keys
export const computeAuditReportData = (
  filesAndFolders: FilesAndFoldersMap,
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap
): AuditReportData => ({
  totalFoldersCount: getFoldersCount(filesAndFolders),
  totalFilesCount: getFileCount(filesAndFolders),
  totalSize: octet2HumanReadableFormat(
    filesAndFoldersMetadata[ROOT_ID].childrenTotalSize
  ),
  oldestDate: formatAuditReportDate(
    filesAndFoldersMetadata[ROOT_ID].minLastModified
  ),
  newestDate: formatAuditReportDate(
    filesAndFoldersMetadata[ROOT_ID].maxLastModified
  ),
  longestPathLength: getLongestPathFile(filesAndFolders).id.length,
  longestPathFileName: getLongestPathFile(filesAndFolders).name,
  longestPathPath: getLongestPathFile(filesAndFolders).id,
  depth: getMaxDepth(filesAndFolders),
  presentationPercent: 11,
  presentationCount: 11,
  documentPercent: 18,
  documentCount: 18,
  spreadsheetPercent: 25,
  spreadsheetCount: 25,
  emailPercent: 21,
  emailCount: 21,
  mediaPercent: 10,
  mediaCount: 10,
  otherPercent: 15,
  otherCount: 15,
  oldestFiles: [
    {
      date: "20/10/1990",
      name: "file1",
      path: "path/to/file1"
    },
    {
      date: "20/10/1990",
      name: "file1",
      path: "path/to/file1"
    },
    {
      date: "20/10/1990",
      name: "file1",
      path: "path/to/file1"
    },
    {
      date: "20/10/1990",
      name: "file1",
      path: "path/to/file1"
    },
    {
      date: "20/10/1990",
      name: "file1",
      path: "path/to/file1"
    }
  ],
  biggestFiles: [
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    }
  ],
  duplicateFolderCount: 10,
  duplicateFolderPercent: 10,
  duplicateFileCount: 10,
  duplicateFilePercent: 10,
  duplicateTotalSize: "2Go",
  duplicates: [
    {
      count: 10,
      name: "file1",
      path: "path/to/file1"
    },
    {
      count: 10,
      name: "file1",
      path: "path/to/file1"
    },
    {
      count: 10,
      name: "file1",
      path: "path/to/file1"
    },
    {
      count: 10,
      name: "file1",
      path: "path/to/file1"
    },
    {
      count: 10,
      name: "file1",
      path: "path/to/file1"
    }
  ],
  biggestDuplicateFiles: [
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    },
    {
      name: "file1",
      path: "path/to/file1",
      size: "2Go"
    }
  ]
});
// tslint:enable:object-literal-sort-keys

/**
 * Thunk to export an audit
 * @param name - name of the output file
 */
export const auditReportExporterThunk = (
  name: string
): ArchifiltreThunkAction => (dispatch, getState) => {
  const filesAndFolders = getFilesAndFoldersFromStore(getState());
  const filesAndFoldersMetadata = getFilesAndFoldersMetadataFromStore(
    getState()
  );
  saveBlob(
    name,
    generateAuditReportDocx(
      computeAuditReportData(filesAndFolders, filesAndFoldersMetadata)
    )
  );
};

export default auditReportExporter;
