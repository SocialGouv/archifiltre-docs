import { FilesAndFoldersMetadata } from "./files-and-folders-metadata-types";

interface OptionalMetadata {
  maxLastModified?: number;
  minLastModified?: number;
  medianLastModified?: number;
  averageLastModified?: number;
  childrenTotalSize?: number;
  nbChildrenFiles?: number;
}

const DEFAULT_MAX_LAST_MODIFIED = 0;
const DEFAULT_MIN_LAST_MODIFIED = 0;
const DEFAULT_MEDIAN_LAST_MODIFIED = 0;
const DEFAULT_AVERAGE_LAST_MODIFIED = 0;
const DEFAULT_CHILDREN_TOTAL_SIZE = 1000;
const DEFAULT_NB_CHILDREN_FILE = 1;

/**
 * Test utils to create FilesAndFoldersMetadata with only the tested parameters
 * @param maxLastModified
 * @param minLastModified
 * @param medianLastModified
 * @param averageLastModified
 * @param childrenTotalSize
 * @param nbChildrenFiles
 */
export const createFilesAndFoldersMetadata = ({
  maxLastModified,
  minLastModified,
  medianLastModified,
  averageLastModified,
  childrenTotalSize,
  nbChildrenFiles
}: OptionalMetadata): FilesAndFoldersMetadata => ({
  averageLastModified: averageLastModified || DEFAULT_AVERAGE_LAST_MODIFIED,
  childrenTotalSize: childrenTotalSize || DEFAULT_CHILDREN_TOTAL_SIZE,
  maxLastModified: maxLastModified || DEFAULT_MAX_LAST_MODIFIED,
  medianLastModified: medianLastModified || DEFAULT_MEDIAN_LAST_MODIFIED,
  minLastModified: minLastModified || DEFAULT_MIN_LAST_MODIFIED,
  nbChildrenFiles: nbChildrenFiles || DEFAULT_NB_CHILDREN_FILE
});
