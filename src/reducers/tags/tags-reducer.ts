import _ from "lodash";
import uuid from "uuid/v4";

import { removeKey } from "../../util/object-util";
import undoable from "../enhancers/undoable/undoable";
import { getTagByName } from "./tags-selectors";
import {
  ADD_TAG,
  DELETE_TAG,
  INITIALIZE_TAGS,
  RENAME_TAG,
  RESET_TAGS,
  TAG_FILE,
  TagsActionTypes,
  TagsState,
  UNTAG_FILE
} from "./tags-types";

const initialState: TagsState = {
  tags: {}
};

/**
 * State mutation to tag a file
 * @param state - Current state
 * @param tagId - The id of the tag to which you add a file
 * @param ffId - The id of the file to add
 * @returns - The new state
 */
const tagFile = (state: TagsState, tagId: string, ffId: string): TagsState => ({
  tags: {
    ...state.tags,
    [tagId]: {
      ...state.tags[tagId],
      ffIds: [...new Set([...state.tags[tagId].ffIds, ffId])]
    }
  }
});

/**
 * State mutation to create a new tag and bind a file to it
 * @param state - Current state
 * @param tagName - The name of the new tag
 * @param ffId - The id of the file to tag
 * @param tagId - The new tag id. Set to "" to generate it with uuid/v4.
 * @returns - The new state
 */
const createTag = (
  state: TagsState,
  tagName: string,
  ffId: string,
  tagId: string
): TagsState => {
  const completeTagId = tagId === "" ? uuid() : tagId;
  return {
    tags: {
      ...state.tags,
      [completeTagId]: {
        ffIds: [ffId],
        id: completeTagId,
        name: tagName
      }
    }
  };
};

/**
 * Reducer that handles tag data structure
 * @param state
 * @param action
 */
const tagsReducer = (
  state = initialState,
  action: TagsActionTypes
): TagsState => {
  switch (action.type) {
    case RESET_TAGS:
      return initialState;
    case INITIALIZE_TAGS:
      return { tags: action.tags };
    case ADD_TAG:
      if (action.ffId === undefined) {
        return state;
      }
      const tagWithTheSameName = getTagByName(state.tags, action.tagName);
      if (tagWithTheSameName === undefined) {
        return createTag(state, action.tagName, action.ffId, action.tagId);
      }
      return tagFile(state, tagWithTheSameName.id, action.ffId);
    case RENAME_TAG:
      return {
        tags: {
          ...state.tags,
          [action.tagId]: { ...state.tags[action.tagId], name: action.tagName }
        }
      };
    case DELETE_TAG:
      return { tags: removeKey(state.tags, action.tagId) };
    case TAG_FILE:
      return tagFile(state, action.tagId, action.ffId);
    case UNTAG_FILE:
      return {
        tags: {
          ...state.tags,
          [action.tagId]: {
            ...state.tags[action.tagId],
            ffIds: _.without([...state.tags[action.tagId].ffIds], action.ffId)
          }
        }
      };
    default:
      return state;
  }
};

export { tagsReducer };

export default undoable(tagsReducer, initialState);
