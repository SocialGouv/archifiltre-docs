import _ from "lodash";
import { removeKey } from "../../util/object-util";
import {
  ADD_TAG,
  DELETE_TAG,
  INITIALIZE_TAGS,
  RENAME_TAG,
  TAG_FILE,
  TagsActionTypes,
  TagsState,
  UNTAG_FILE
} from "./tags-types";

import uuid from "uuid/v4";
import { getTagByName } from "./tags-selectors";

const initialState: TagsState = {
  tags: {}
};

const tagFile = (state: TagsState, tagId: string, ffId: string): TagsState => ({
  tags: {
    ...state.tags,
    [tagId]: {
      ...state.tags[tagId],
      ffIds: [...new Set([...state.tags[tagId].ffIds, ffId])]
    }
  }
});

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

const tagsReducer = (
  state = initialState,
  action: TagsActionTypes
): TagsState => {
  switch (action.type) {
    case INITIALIZE_TAGS:
      return { tags: action.tags };
    case ADD_TAG:
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

export default tagsReducer;
