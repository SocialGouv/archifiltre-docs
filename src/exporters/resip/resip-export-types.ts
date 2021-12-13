import type { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import type { TagMap } from "../../reducers/tags/tags-types";

export interface ResipExportInitData {
    filesAndFolders: FilesAndFoldersMap;
    tags: TagMap;
}
