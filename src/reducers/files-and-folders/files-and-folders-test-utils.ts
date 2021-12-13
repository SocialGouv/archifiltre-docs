/* eslint-disable @typescript-eslint/naming-convention */
import type { FilesAndFolders } from "./files-and-folders-types";

interface CreateFilesAndFoldersOptions {
    id: string;
    file_last_modified?: number;
    children?: string[];
    file_size?: number;
    name?: string;
    virtualPath?: string;
}

/**
 * Utility function to create a prefilled filesAndFolders.
 */
export const createFilesAndFolders = ({
    id,
    file_last_modified = 0,
    children = [],
    file_size = 0,
    name = "base-name",
    virtualPath,
}: CreateFilesAndFoldersOptions): Partial<FilesAndFolders> => ({
    children,
    file_last_modified,
    file_size,
    id,
    name,
    virtualPath: virtualPath ?? id,
});
