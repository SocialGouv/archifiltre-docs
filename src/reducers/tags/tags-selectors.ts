import _ from "lodash";

import { getCurrentState } from "../enhancers/undoable/undoable-selectors";
import type { FilesAndFoldersMap } from "../files-and-folders/files-and-folders-types";
import type { FilesAndFoldersMetadataMap } from "../files-and-folders-metadata/files-and-folders-metadata-types";
import type { StoreState } from "../store";
import type { Tag, TagMap } from "./tags-types";

/**
 * Returns all the tags ids that are associated to the provided ffId
 * @param tagMap - The TagMap as in the redux store
 * @param ffId - The ffid
 * @returns The list of tagIds for the file
 */
export const getAllTagIdsForFile = (tagMap: TagMap, ffId: string): string[] =>
    Object.keys(tagMap).filter((key) => tagHasFfId(tagMap[key], ffId));

/**
 * Returns all the tags that are associated to the provided ffId
 * @param tagMap - The TagMap as in the redux store
 * @param ffId - The ffid
 * @returns The list of tags for the file
 */
export const getAllTagsForFile = (tagMap: TagMap, ffId: string): Tag[] =>
    tagMapToArray(tagMap).filter((tag) => tagHasFfId(tag, ffId));

/**
 * Returns the tags corresponding to the ids in tagIds
 * @param tagMap - The TagMap as in the redux store
 * @param tagIds - the tags ids
 */
export const getTagsByIds = (tagMap: TagMap, tagIds: string[]): Tag[] =>
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    tagIds.map((tagId) => tagMap[tagId] || null).filter((tag) => tag !== null);

/**
 * Checks if the tag name already exist
 * @param tagMap
 * @param name
 */
export const getTagByName = (tagMap: TagMap, name: string): Tag | undefined =>
    _.find(tagMapToArray(tagMap), (tag) => tag.name === name);

/**
 * Order for sorting functions
 */
export enum Order {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ASC = 0,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    DESC = 1,
}

export interface SortTagOptions {
    order?: Order;
    sortParam?: keyof Tag;
}

const defaultSortTagOptions: SortTagOptions = {};

/**
 * Sort tags
 * @param tagList The tag list to sort
 * @param options The sort options
 * @param {Order} [options.order=Order.ASC] The sort order. Defaults to Ascending.
 * @param {string} [options.sortParam="name"] The param to sort on. Defaults to name.
 */
export const sortTags = (
    tagList: Tag[],
    options = defaultSortTagOptions
): Tag[] => {
    const order = options.order ?? Order.ASC;
    const sortParam = options.sortParam ?? "name";

    const sortFunction = (tag1: Tag, tag2: Tag) => {
        if (tag1[sortParam] < tag2[sortParam]) {
            return order === Order.ASC ? -1 : 1;
        }
        if (tag1[sortParam] === tag2[sortParam]) {
            return 0;
        }
        return order === Order.ASC ? 1 : -1;
    };

    return tagList.sort(sortFunction);
};

/**
 * Computes a tag size based on the files and folders size
 * @param tag - The tag which you want to compute the value
 * @param filesAndFolders - The files and folders structure
 * @param filesAndFoldersMetadata - The files and folders metadata
 * @returns the total size of the tagged files and folders
 */
export const getTagSize = (
    tag: Tag,
    filesAndFolders: FilesAndFoldersMap,
    filesAndFoldersMetadata: FilesAndFoldersMetadataMap
): number => {
    const parentIsTagged = (
        taggedFfidsList: string[],
        potentialChildId: string
    ) =>
        taggedFfidsList.some(
            (potentialParentId) =>
                potentialChildId.startsWith(potentialParentId) &&
                potentialChildId[potentialParentId.length] === "/"
        );

    const taggedFfIds = tag.ffIds.filter(
        (id) => !parentIsTagged(tag.ffIds, id)
    );

    return taggedFfIds.reduce(
        (totalSize, id) =>
            totalSize + filesAndFoldersMetadata[id].childrenTotalSize,
        0
    );
};

export const tagMapToArray = (tagMap: TagMap): Tag[] => Object.values(tagMap);

export const tagHasFfId = (tag: Tag, ffId: string): boolean =>
    tag.ffIds.includes(ffId);

/**
 * Gets the tags map from the redux store.
 * @param store The redux store
 */
export const getTagsFromStore = (store: StoreState): TagMap =>
    getCurrentState(store.tags).tags;
