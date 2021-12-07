import _, { without } from "lodash";
import path from "path";

import { undoable } from "../enhancers/undoable/undoable";
import type {
    FilesAndFoldersActionTypes,
    FilesAndFoldersMap,
    FilesAndFoldersState,
    VirtualPathToIdMap,
} from "./files-and-folders-types";
import {
    ADD_CHILD,
    ADD_COMMENTS_ON_FILES_AND_FOLDERS,
    INIT_OVERRIDE_LAST_MODIFIED,
    INIT_VIRTUAL_PATH_TO_ID_MAP,
    INITIALIZE_FILES_AND_FOLDERS,
    MARK_AS_TO_DELETE,
    MARK_ELEMENTS_TO_DELETE,
    OVERRIDE_LAST_MODIFIED,
    REGISTER_ERRORED_ELEMENTS,
    REMOVE_CHILD,
    RESET_ERRORED_ELEMENTS,
    RESET_OVERRIDE_LAST_MODIFIED,
    SET_FILES_AND_FOLDERS_ALIAS,
    UNMARK_AS_TO_DELETE,
    UNMARK_ELEMENTS_TO_DELETE,
} from "./files-and-folders-types";

export const initialState: FilesAndFoldersState = {
    aliases: {},
    comments: {},
    elementsToDelete: [],
    erroredFilesAndFolders: [],
    filesAndFolders: {},
    overrideLastModified: {},
    virtualPathToId: {},
};

/**
 * Generates updated filesAndFolders map and virtualPathToId map for the moved filesAndFolders
 */
const updateChildVirtualPath = (
    filesAndFolders: FilesAndFoldersMap,
    virtualPathToId: VirtualPathToIdMap,
    movedElementId: string,
    newParentVirtualPath: string
) => {
    const updatedFilesAndFolders = {
        ...filesAndFolders,
    };

    const updatedVirtualPathToId = {
        ...virtualPathToId,
    };

    const updateChildVirtualPathRec = (
        currentId: string,
        currentParentVirtualPath: string
    ) => {
        const filesAndFolder = updatedFilesAndFolders[currentId];

        const virtualPath = path.posix.join(
            currentParentVirtualPath,
            filesAndFolder.name
        );

        updatedVirtualPathToId[virtualPath] = currentId;
        updatedFilesAndFolders[currentId] = {
            ...filesAndFolder,
            virtualPath,
        };

        filesAndFolder.children.map((childId) => {
            updateChildVirtualPathRec(childId, virtualPath);
        });
    };

    updateChildVirtualPathRec(movedElementId, newParentVirtualPath);

    return {
        filesAndFolders: updatedFilesAndFolders,
        virtualPathToId: updatedVirtualPathToId,
    };
};

/**
 * Reducer that handles files and folders data structure
 * @param state
 * @param action
 */
const filesAndFoldersReducer = (
    state = initialState,
    action?: FilesAndFoldersActionTypes
): FilesAndFoldersState => {
    switch (action?.type) {
        case INITIALIZE_FILES_AND_FOLDERS:
            return { ...state, filesAndFolders: action.filesAndFolders };
        case ADD_CHILD:
            // eslint-disable-next-line no-case-declarations
            const parent = state.filesAndFolders[action.parentId];
            // eslint-disable-next-line no-case-declarations
            const { filesAndFolders, virtualPathToId } = updateChildVirtualPath(
                state.filesAndFolders,
                state.virtualPathToId,
                action.childId,
                parent.virtualPath
            );
            return {
                ...state,
                filesAndFolders: {
                    ...filesAndFolders,
                    [action.parentId]: {
                        ...parent,
                        children: _.uniq(
                            parent.children.concat([action.childId])
                        ),
                    },
                },
                virtualPathToId,
            };
        case REMOVE_CHILD:
            return {
                ...state,
                filesAndFolders: {
                    ...state.filesAndFolders,
                    [action.parentId]: {
                        ...state.filesAndFolders[action.parentId],
                        children: _.without(
                            state.filesAndFolders[action.parentId].children,
                            action.childId
                        ),
                    },
                },
            };
        case SET_FILES_AND_FOLDERS_ALIAS:
            return {
                ...state,
                aliases: {
                    ...state.aliases,
                    ...action.aliases,
                },
            };
        case ADD_COMMENTS_ON_FILES_AND_FOLDERS:
            return {
                ...state,
                comments: {
                    ...state.comments,
                    ...action.comments,
                },
            };
        case MARK_AS_TO_DELETE:
            return {
                ...state,
                elementsToDelete: [
                    ...new Set([
                        ...state.elementsToDelete,
                        action.filesAndFoldersId,
                    ]),
                ],
            };
        case UNMARK_AS_TO_DELETE:
            return {
                ...state,
                elementsToDelete: _.without(
                    state.elementsToDelete,
                    action.filesAndFoldersId
                ),
            };
        case MARK_ELEMENTS_TO_DELETE:
            return {
                ...state,
                elementsToDelete: [
                    ...new Set([
                        ...state.elementsToDelete,
                        ...action.elementIds,
                    ]),
                ],
            };
        case UNMARK_ELEMENTS_TO_DELETE:
            return {
                ...state,
                elementsToDelete: without(
                    state.elementsToDelete,
                    ...action.elementIds
                ),
            };
        case INIT_VIRTUAL_PATH_TO_ID_MAP:
            return {
                ...state,
                virtualPathToId: action.virtualPathToIdMap,
            };
        case REGISTER_ERRORED_ELEMENTS:
            return {
                ...state,
                erroredFilesAndFolders: [
                    ...state.erroredFilesAndFolders,
                    ...action.elements,
                ],
            };
        case RESET_ERRORED_ELEMENTS:
            return {
                ...state,
                erroredFilesAndFolders: [],
            };
        case OVERRIDE_LAST_MODIFIED:
            return {
                ...state,
                overrideLastModified: {
                    ...state.overrideLastModified,
                    [action.elementId]: action.lastModified,
                },
            };
        case INIT_OVERRIDE_LAST_MODIFIED:
            return {
                ...state,
                overrideLastModified: action.overrideLastModified,
            };
        case RESET_OVERRIDE_LAST_MODIFIED:
            return {
                ...state,
                overrideLastModified: initialState.overrideLastModified,
            };
        default:
            return state;
    }
};

const undoableFilesAndFoldersReducer = undoable(
    filesAndFoldersReducer,
    initialState
);

export { filesAndFoldersReducer, undoableFilesAndFoldersReducer };
