import _, { sortBy } from "lodash";
import path from "path";
import { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { getFilesAndFoldersDepth } from "../../reducers/files-and-folders/files-and-folders-selectors";
import {
  FilesAndFoldersMap,
  HashesMap
} from "../../reducers/files-and-folders/files-and-folders-types";
import { Tag, TagMap } from "../../reducers/tags/tags-types";
import translations from "../../translations/translations";
import { WorkerMessageHandler } from "../../util/async-worker-util";
import { MessageTypes } from "../../util/batch-process/batch-process-util-types";
import { arrayToCsv } from "../../util/csv-util";
import { formatPathForUserSystem } from "../../util/file-sys-util";

interface MakeCsvHeaderOptions {
  withHashes: boolean;
}

/**
 * Generates the csv header for the CSV export
 * @param tags
 * @param withHash
 */
const makeCsvHeader = (tags: Tag[], { withHashes }: MakeCsvHeaderOptions) => {
  const header = [
    "",
    translations.t("csvHeader.path"),
    translations.t("csvHeader.pathLength"),
    translations.t("csvHeader.name"),
    translations.t("csvHeader.extension"),
    translations.t("csvHeader.size"),
    translations.t("csvHeader.firstModified"),
    translations.t("csvHeader.lastModified"),
    translations.t("csvHeader.newName"),
    translations.t("csvHeader.description"),
    translations.t("csvHeader.fileOrFolder"),
    translations.t("csvHeader.depth")
  ];

  if (withHashes) {
    header.push(translations.t("csvHeader.hash"));
  }

  const tagNames = tags.map(({ name }, index) => `tag${index} : ${name}`);

  header.push(...tagNames);

  return header;
};

/**
 * Simple date formatting function for performance matters.
 * @param timestamp
 */
const formatOutputDate = timestamp => {
  const date = new Date(timestamp);
  const day = `0${date.getUTCDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Generates a map of the list of tag ids for each ffId
 * @param tags - The tags map
 */
const tagIdByFfId = (tags: TagMap) => {
  const tagIdByFfIdMap = {};
  Object.keys(tags).forEach(tagId => {
    const tag = tags[tagId];
    tag.ffIds.forEach(ffId => {
      if (!tagIdByFfIdMap[ffId]) {
        tagIdByFfIdMap[ffId] = [];
      }
      tagIdByFfIdMap[ffId].push(tagId);
    });
  });

  return tagIdByFfIdMap;
};

/**
 * Determines if suspectedParentId is an ancestor (or the same file) of baseElementId
 * @param baseElementId
 * @param suspectedAncestorId
 */
const isExactFileOrAncestor = (baseElementId, suspectedAncestorId) => {
  const index = baseElementId.indexOf(suspectedAncestorId);
  const trailingChar = baseElementId[suspectedAncestorId.length];
  return index === 0 && (trailingChar === undefined || trailingChar === "/");
};

interface TagByFfIdMap {
  [id: string]: string[];
}

/**
 * Get the list of all tags on the file and its ancestors
 * @param tagIdByFfIdMap
 * @param elementId
 */
const getTagsForFileOrAncestors = (
  tagIdByFfIdMap: TagByFfIdMap,
  elementId
): string[] =>
  _(Object.keys(tagIdByFfIdMap))
    .filter(ffId => isExactFileOrAncestor(elementId, ffId))
    .map(matchedFfId => tagIdByFfIdMap[matchedFfId])
    .flatten()
    .value();

interface CsvExporterData {
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  hashes?: HashesMap;
  language: string;
  tags: TagMap;
}

/**
 * Handles the initialize message for the CSV exporter fork
 * @param asyncWorker - The async worker instance
 * @param filesAndFolders
 * @param filesAndFoldersMetadata
 * @param hashes
 * @param language
 * @param tags
 */
export const onInitialize: WorkerMessageHandler = async (
  asyncWorker,
  {
    filesAndFolders,
    filesAndFoldersMetadata,
    hashes,
    language,
    tags
  }: CsvExporterData
) => {
  await translations.changeLanguage(language);

  const orderedTags = sortBy(tags, "name");
  const withHashes = hashes !== undefined;
  const header = makeCsvHeader(orderedTags, { withHashes });
  const folderText = translations.t("common.folder");
  const fileText = translations.t("common.file");
  const tagIdByFfIdMap = tagIdByFfId(tags);

  const lines = Object.keys(filesAndFolders)
    .filter(ffId => ffId !== "")
    .map((ffId): string[] => {
      const currentFf = filesAndFolders[ffId];
      const currentMetadata = filesAndFoldersMetadata[ffId];
      const filePath = formatPathForUserSystem(ffId);
      const pathLength = `${filePath.length}`;
      const name = currentFf.name;
      const extension = path.extname(name);
      const size = `${currentMetadata.childrenTotalSize}`;
      const firstModifiedDate = formatOutputDate(
        currentMetadata.minLastModified
      );
      const lastModifiedDate = formatOutputDate(
        currentMetadata.maxLastModified
      );
      const alias = currentFf.alias;
      const comments = currentFf.comments;
      const fileOrFolder =
        currentFf.children.length === 0 ? fileText : folderText;
      const depth = `${getFilesAndFoldersDepth(ffId)}`;

      const line = [
        "",
        filePath,
        pathLength,
        name,
        extension,
        size,
        firstModifiedDate,
        lastModifiedDate,
        alias,
        comments,
        fileOrFolder,
        depth
      ];

      if (hashes) {
        line.push(hashes[ffId]);
      }

      const tagsForCurrentFile = getTagsForFileOrAncestors(
        tagIdByFfIdMap,
        ffId
      );

      const tagsArray = orderedTags.map(tag =>
        tagsForCurrentFile.includes(tag.id) ? tag.name : ""
      );

      line.push(...tagsArray);

      asyncWorker.postMessage({
        result: ffId,
        type: MessageTypes.RESULT
      });

      return line;
    });

  asyncWorker.postMessage({
    result: arrayToCsv([header, ...lines]),
    type: MessageTypes.RESULT
  });

  asyncWorker.postMessage({
    type: MessageTypes.COMPLETE
  });
};
