import path from "path";
import dateFormat from "dateformat";
import { makeEmptyArray, replaceValue } from "../util/array-util";

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

/**
 * Mapper that transform enriched archifiltre data to Resip compatible data
 * @param enrichedFilesAndFolders
 * @returns {Object} - Resip compatible data
 */
const transformDefaultFormatToResip = enrichedFilesAndFolders => ({
  ID: enrichedFilesAndFolders.ID,
  ParentID: enrichedFilesAndFolders.ParentID,
  File: formatFile(enrichedFilesAndFolders),
  DescriptionLevel: formatDescriptionLevel(enrichedFilesAndFolders),
  Title: formatTitle(enrichedFilesAndFolders),
  StartDate: formatDate(enrichedFilesAndFolders.last_modified_min),
  EndDate: formatDate(enrichedFilesAndFolders.last_modified_max),
  TransactedDate: formatDate(Date.now()),
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
    (tagList, tag) => (tag.ff_ids.includes(ffId) ? [...tagList, tag] : tagList),
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
    "Description"
  ];
  const tagsFields = tags.map((tag, index) => `Tag${index}`);

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
 * Formats the fileStructure and tag into a csv that can be imported in RESIP
 * @param files_and_folders - The files and folder structure
 * @param tags - The tags structure
 */
const resipExporter = ({ files_and_folders, tags }) => {
  let sipId = 0;

  const addSipId = ff => {
    sipId = sipId + 1;
    return { ...ff, ID: sipId };
  };

  const tagsWithIndex = Object.keys(tags).map((tagId, tagIndex) => ({
    ...tags[tagId],
    ID: tagIndex
  }));

  const dataWithSipId = Object.keys(files_and_folders)
    .map(ffId => ({ id: ffId, ...files_and_folders[ffId] }))
    .filter(({ id }) => id !== "")
    .map(addSipId)
    .map(addParentId)
    .map(addTagsToFf(tagsWithIndex));

  const formattedData = dataWithSipId.map(transformDefaultFormatToResip);

  const csvData = formatToCsv(formattedData, tagsWithIndex);
  return csvData;
};

export default resipExporter;
