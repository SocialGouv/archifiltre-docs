import dateFormat from "dateformat";
import path from "path";
import { tagHasFfId } from "../../reducers/tags/tags-selectors";
import translations from "../../translations/translations";
import { makeEmptyArray, replaceValue } from "../../util/array-util";
import { empty } from "../../util/function-util";

const nameChangedText = oldName =>
  translations.t("common.originalName", { oldName });

const formatFile = ff => {
  const removeStartingSlash = str =>
    str.indexOf("/") === 0 ? str.substring(1) : str;

  const resipFilePath = removeStartingSlash(ff.id)
    .split("/")
    .slice(1)
    .join("/");

  // We format the file path for the current file system
  return path.join(resipFilePath);
};

/**
 * Returns the SEDA description level corresponding to the FF item
 * @param ff
 * @returns {string}
 */
const formatDescriptionLevel = ff => {
  if (ff.children.length === 0) {
    return "Item";
  }

  return "RecordGrp";
};

/**
 * Gets the title of a file or folder
 * @param ff - a file or folder data object
 * @returns {string} The file title
 */
const formatTitle = ff => (ff.alias !== "" ? ff.alias : path.basename(ff.id));

/**
 * Formats the date to "yyyy-mm-dd"
 * @param date
 */
const formatDate = date => dateFormat(date, "yyyy-mm-dd");

/**
 * Mapper to enrich fileOrFolder with parentId.
 * @param fileOrFolder
 * @param index
 * @param fileAndFolders
 * @returns {{ParentID: *}} - fileOrFolder with ParentID
 */
const addParentId = (fileOrFolder, index, fileAndFolders) => {
  const parent = fileAndFolders.find(({ children }) =>
    children.includes(fileOrFolder.id)
  );

  return {
    ...fileOrFolder,
    ParentID: parent && parent.ID
  };
};

const formatCustodialHistory = fileAndFolder =>
  fileAndFolder.alias !== "" ? nameChangedText(fileAndFolder.name) : "";

/**
 * Mapper that transform enriched archifiltre data to Resip compatible data
 * @param enrichedFilesAndFolders
 * @returns {Object} - Resip compatible data
 */
const transformDefaultFormatToResip = enrichedFilesAndFolders => ({
  ID: enrichedFilesAndFolders.ID,
  ParentID: enrichedFilesAndFolders.ParentID,
  // tslint:disable-next-line:object-literal-sort-keys
  File: formatFile(enrichedFilesAndFolders),
  DescriptionLevel: formatDescriptionLevel(enrichedFilesAndFolders),
  Title: formatTitle(enrichedFilesAndFolders),
  StartDate: formatDate(enrichedFilesAndFolders.last_modified_min),
  EndDate: formatDate(enrichedFilesAndFolders.last_modified_max),
  TransactedDate: formatDate(Date.now()),
  "CustodialHistory.CustodialHistoryItem": formatCustodialHistory(
    enrichedFilesAndFolders
  ),
  Description: enrichedFilesAndFolders.comments,
  Tags: enrichedFilesAndFolders.tags
});

/**
 * Returns all tags for the provided fileAndFolder id
 * @param tags
 * @param ffId
 * @returns {*}
 */
const getAllTagsByFfId = (tags, ffId) =>
  tags.reduce(
    (tagList, tag) => (tagHasFfId(tag, ffId) ? [...tagList, tag] : tagList),
    []
  );

const addTagsToFf = tags => ff => ({
  ...ff,
  tags: getAllTagsByFfId(tags, ff.id)
});

const formatToCsv = (sipFilesAndFolders, tags) => {
  const fieldsOrder = [
    "ID",
    "ParentID",
    "File",
    "DescriptionLevel",
    "Title",
    "StartDate",
    "EndDate",
    "TransactedDate",
    "CustodialHistory.CustodialHistoryItem",
    "Description"
  ];
  const tagsFields = tags.map((tag, index) => `Content.Tag.${index}`);

  const firstRow = fieldsOrder.concat(tagsFields);

  const dataRows = sipFilesAndFolders.map(sipFileAndFolder => {
    const baseFileAndFolder = fieldsOrder.map(
      field => sipFileAndFolder[field] || ""
    );
    const tagsCells = sipFileAndFolder.Tags.reduce(
      (acc, { ID, name }) => replaceValue(acc, ID, name),
      makeEmptyArray(tags.length, "")
    );

    return [...baseFileAndFolder, ...tagsCells];
  });

  return [firstRow].concat(dataRows);
};

/**
 * Wraps a mapper with a side effect function called before the hook
 * @param mapper - the wrapped mapper that will still be called.
 * @param sideEffect - the side effect called with the mapper parameters
 * @returns {function} - The mapper that will call the hook every time the mapper called.
 */
const wrapWithHook = (mapper, sideEffect) => (
  mappedElement,
  mappedIndex,
  mappedArray
) => {
  sideEffect(mappedElement, mappedIndex, mappedArray);
  return mapper(mappedElement, mappedIndex, mappedArray);
};

/**
 * Formats the fileStructure and tag into a csv that can be imported in RESIP
 * @param filesAndFolders - The files and folder structure
 * @param tags - The tags structure
 * @param [hook]
 */
const resipExporter = (filesAndFolders, tags, hook = empty) => {
  let sipId = 0;

  const addSipId = ff => {
    sipId = sipId + 1;
    return { ...ff, ID: `${sipId}` };
  };

  const tagsWithIndex = Object.keys(tags).map((tagId, tagIndex) => ({
    ...tags[tagId],
    ID: tagIndex
  }));

  const dataWithSipId = Object.keys(filesAndFolders)
    .filter(id => id !== "")
    .map(wrapWithHook(ffId => ({ id: ffId, ...filesAndFolders[ffId] }), hook))
    .map(wrapWithHook(addSipId, hook))
    .map(wrapWithHook(addParentId, hook))
    .map(wrapWithHook(addTagsToFf(tagsWithIndex), hook));

  const formattedData = dataWithSipId.map(transformDefaultFormatToResip);

  return formatToCsv(formattedData, tagsWithIndex);
};

export default resipExporter;
