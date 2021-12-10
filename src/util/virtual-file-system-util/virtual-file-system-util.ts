import _ from "lodash";
import { compose } from "lodash/fp";

import { createFilesAndFoldersMetadataDataStructure } from "../../files-and-folders-loader/file-system-loading-process-utils";
import type { VirtualFileSystem } from "../../files-and-folders-loader/files-and-folders-loader-types";
import { ROOT_FF_ID } from "../../reducers/files-and-folders/files-and-folders-selectors";
import type { FilesAndFoldersMap } from "../../reducers/files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import type { Tag, TagMap } from "../../reducers/tags/tags-types";
import { isIgnored } from "../hidden-file/hidden-file-util";

export interface WithFilesAndFolders {
    filesAndFolders: FilesAndFoldersMap;
}
export interface WithFilesAndFoldersMetadata {
    filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
}
export interface WithTags {
    tags: TagMap;
}

/**
 * Recursive implementation for removeIgnoredFilesAndFoldersFromVirtualFileSystem
 * @param filesAndFolders
 * @param elementId
 */
const removeHiddenFilesRec = (
    filesAndFolders: FilesAndFoldersMap,
    elementId: string
): FilesAndFoldersMap => {
    const element = filesAndFolders[elementId];

    if (element.children.length === 0) {
        return isIgnored(elementId) ? {} : { [elementId]: element };
    }

    const nextFilesAndFolders: FilesAndFoldersMap = Object.assign(
        {},
        ...element.children.map((childId) =>
            removeHiddenFilesRec(filesAndFolders, childId)
        )
    );

    const nextChildren = _.intersection(
        element.children,
        Object.keys(nextFilesAndFolders)
    );

    if (nextChildren.length === 0) {
        return nextFilesAndFolders;
    }

    return Object.assign(
        {
            [elementId]: {
                ...element,
                children: nextChildren,
            },
        },
        nextFilesAndFolders
    );
};

/**
 * Remove ignored filesAndFolders from a VirtualFileSystem
 * @param vfs
 */
export const removeIgnoredFilesAndFoldersFromVirtualFileSystem = <
    T extends WithFilesAndFolders
>(
    vfs: T
): T => {
    return {
        ...vfs,
        filesAndFolders: removeHiddenFilesRec(vfs.filesAndFolders, ROOT_FF_ID),
    };
};

/**
 * Recompute the filesAndFoldersMetadata of a VirtualFileSystem based on the filesAndFolders
 * @param vfs
 */
export const recomputeVirtualFileSystemMetadata = <
    T extends WithFilesAndFolders & WithFilesAndFoldersMetadata
>(
    vfs: T
): T => ({
    ...vfs,
    filesAndFoldersMetadata: createFilesAndFoldersMetadataDataStructure(
        vfs.filesAndFolders
    ),
});

/**
 * Remove keys that correspond to no filesAndFolders key in a map of a VirtualFileSystem;
 * @param key - The name of the map to process
 */
const removeMissingFilesAndFoldersFromFileSystemMap =
    (key: keyof VirtualFileSystem) =>
    <T extends Partial<VirtualFileSystem> & WithFilesAndFolders>(
        vfs: T
    ): T => ({
        ...vfs,
        [key]: _.pick(vfs[key], Object.keys(vfs.filesAndFolders)),
    });

/**
 * Remove comments that correspond to no filesAndFolders
 */
export const removeUnusedCommentsFromVirtualFileSystem =
    removeMissingFilesAndFoldersFromFileSystemMap("comments");

/**
 * Remove aliases that correspond to no filesAndFolders
 */
export const removeUnusedAliasesFromVirtualFileSystem =
    removeMissingFilesAndFoldersFromFileSystemMap("aliases");

/**
 * Remove non referenced filesAndFolders from tags in a VirtualFileSystem
 * @param vfs
 */
export const removeUnusedTagsFromVirtualFileSystem = <
    T extends WithFilesAndFolders & WithTags
>(
    vfs: T
): T => {
    const filesAndFoldersKeys = Object.keys(vfs.filesAndFolders);
    return {
        ...vfs,
        tags: _.chain(vfs.tags)
            .mapValues(
                (tag: Tag): Tag => ({
                    ...tag,
                    ffIds: _.intersection(tag.ffIds, filesAndFoldersKeys),
                })
            )
            .pickBy((tag: Tag) => tag.ffIds.length !== 0)
            .value() as TagMap,
    };
};

/**
 * Clean up ignored files name from a VirtualFileSystem
 */
export const removeIgnoredElementsFromVirtualFileSystem = (
    virtualFileSystem: VirtualFileSystem
): VirtualFileSystem =>
    compose(
        removeUnusedTagsFromVirtualFileSystem,
        removeUnusedAliasesFromVirtualFileSystem,
        removeUnusedCommentsFromVirtualFileSystem,
        recomputeVirtualFileSystemMetadata,
        removeIgnoredFilesAndFoldersFromVirtualFileSystem
    )(virtualFileSystem) as VirtualFileSystem;
