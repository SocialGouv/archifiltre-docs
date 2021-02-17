import { StoreState } from "../store";
import {
  FilesAndFoldersMetadata,
  FilesAndFoldersMetadataMap,
} from "./files-and-folders-metadata-types";
import { getCurrentState } from "reducers/enhancers/undoable/undoable-selectors";

/**
 * Gets the files and folder metadata map from the redux state
 * @param store - The current redux state
 */
export const getFilesAndFoldersMetadataFromStore = (
  store: StoreState
): FilesAndFoldersMetadataMap =>
  getCurrentState(store.filesAndFoldersMetadata).filesAndFoldersMetadata;
type OptionalMetadata = Partial<FilesAndFoldersMetadata>;
const DEFAULT_MAX_LAST_MODIFIED = 0;
const DEFAULT_MIN_LAST_MODIFIED = 0;
const DEFAULT_MEDIAN_LAST_MODIFIED = 0;
const DEFAULT_AVERAGE_LAST_MODIFIED = 0;
const DEFAULT_CHILDREN_TOTAL_SIZE = 1000;
const DEFAULT_NB_CHILDREN_FILE = 1;
const DEFAULT_SORT_BY_SIZE_INDEX = [0];
const DEFAULT_SORT_BY_DATE_INDEX = [0];
const DEFAULT_SORT_ALPHA_NUMERICALLY_INDEX = [0];
/**
 * Test common to create FilesAndFoldersMetadata with only the tested parameters
 * @param maxLastModified
 * @param minLastModified
 * @param medianLastModified
 * @param averageLastModified
 * @param initialMinLastModified
 * @param initialMedianLastModified
 * @param initialMaxLastModified
 * @param childrenTotalSize
 * @param nbChildrenFiles
 * @param sortBySizeIndex
 * @param sortByDateIndex
 * @param sortAlphaNumericallyIndex
 */
export const createFilesAndFoldersMetadata = ({
  maxLastModified,
  minLastModified,
  medianLastModified,
  averageLastModified,
  initialMinLastModified,
  initialMedianLastModified,
  initialMaxLastModified,
  childrenTotalSize,
  nbChildrenFiles,
  sortBySizeIndex,
  sortByDateIndex,
  sortAlphaNumericallyIndex,
}: OptionalMetadata): FilesAndFoldersMetadata => ({
  averageLastModified: averageLastModified || DEFAULT_AVERAGE_LAST_MODIFIED,
  childrenTotalSize: childrenTotalSize || DEFAULT_CHILDREN_TOTAL_SIZE,
  maxLastModified: maxLastModified || DEFAULT_MAX_LAST_MODIFIED,
  medianLastModified: medianLastModified || DEFAULT_MEDIAN_LAST_MODIFIED,
  minLastModified: minLastModified || DEFAULT_MIN_LAST_MODIFIED,
  initialMinLastModified:
    initialMinLastModified || minLastModified || DEFAULT_MIN_LAST_MODIFIED,
  initialMedianLastModified:
    initialMedianLastModified ||
    medianLastModified ||
    DEFAULT_MEDIAN_LAST_MODIFIED,
  initialMaxLastModified:
    initialMaxLastModified || maxLastModified || DEFAULT_MAX_LAST_MODIFIED,
  nbChildrenFiles: nbChildrenFiles || DEFAULT_NB_CHILDREN_FILE,
  sortByDateIndex: sortByDateIndex || DEFAULT_SORT_BY_DATE_INDEX,
  sortBySizeIndex: sortBySizeIndex || DEFAULT_SORT_BY_SIZE_INDEX,
  sortAlphaNumericallyIndex:
    sortAlphaNumericallyIndex || DEFAULT_SORT_ALPHA_NUMERICALLY_INDEX,
});
