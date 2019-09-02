import dateFormat from "dateformat";

import {
  countDeeperFolders,
  countFoldersWithMoreThanNChildren,
  countLongerPath,
  findAllFoldersWithNoSubfolder,
  sortFoldersByChildrenCount,
  sortFoldersByDepth
} from "../util/file-and-folders-utils";
import { percent } from "../util/numbers-util";
import { medianOnSortedArray } from "../util/array-util";
import { exportToDocX } from "../util/docx-util";

const CHILDREN_LIMIT = 30;
const NB_FOLDERS_TO_DISPLAY = 10;
const MAX_FOLDERS_DEPTH = 7;
const MAX_PATH_LENGTH = 200;
const TEMPLATE_PATH = "template/auditTemplate.docx";

/**
 * Transforms a fileAndFolders object to an array
 * @param filesAndFolders - An object with id (the path) as a key and the fileAndFolders data as a value
 * @returns {{Object}[]}
 */
const filesAndFoldersMapToArray = filesAndFolders =>
  Object.keys(filesAndFolders)
    .filter(id => id !== "")
    .map(key => ({
      ...filesAndFolders[key],
      id: key
    }));

/**
 * Filters files and folders to only get folders
 * @param filesAndFolders
 * @returns {*}
 */
const getFolders = filesAndFolders =>
  filesAndFolders.filter(({ children }) => children.length > 0);

/**
 * Returns a blob containing the docx content for an audit report
 * This is based on the template defined in the const TEMPLATE_PATH
 * @param files_and_folders - The file and folder list
 * @returns {Blob}
 */
const auditReportExporter = ({ files_and_folders }) => {
  const filesAndFoldersArray = filesAndFoldersMapToArray(files_and_folders);

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
    files_and_folders
  ).map(folderId => ({ id: folderId, ...files_and_folders[folderId] }));

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

  const pathList = Object.keys(files_and_folders);

  const orderedPathList = pathList.sort((a, b) => b.length - a.length);
  const pathLengthMedian = medianOnSortedArray(
    orderedPathList.map(path => path.length)
  );

  const nbPathTooLong = countLongerPath(MAX_PATH_LENGTH)(pathList);
  const nbPathTooLongPercent = percent(nbPathTooLong, nbElements);

  let docxData = {
    creationDate: dateFormat(new Date(), "dd/mm/yyyy"),
    nbFolders,
    nbFoldersWithTooManyChildren,
    nbFoldersWithTooManyChildrenPercent: `${nbFoldersWithTooManyChildrenPercent}%`,
    medianOfChildren,
    nbFoldersWithNoSubfolders: foldersWithNoSubfolders.length,
    nbFoldersTooDeep,
    foldersTooDeepPercent: `${foldersTooDeepPercent}%`,
    medianDepth,
    nbElements,
    pathLengthMedian,
    nbPathTooLong,
    nbPathTooLongPercent: `${nbPathTooLongPercent}%`
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
      (acc, path, index) => ({
        ...acc,
        [`longPath${index + 1}Path`]: path,
        [`longPath${index + 1}Value`]: path.length
      }),
      {}
    );

  docxData = {
    ...docxData,
    ...foldersWithMostChildrenValues,
    ...deepestFoldersValues,
    ...longestPathValues
  };

  const blob = exportToDocX(TEMPLATE_PATH, docxData);

  return blob;
};

export default auditReportExporter;
