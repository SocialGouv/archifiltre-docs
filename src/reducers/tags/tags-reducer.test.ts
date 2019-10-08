import uuid from "uuid/v4";
import {
  addTag,
  deleteTag,
  initializeTags,
  renameTag,
  resetTags,
  tagFile,
  untagFile
} from "./tags-actions";
import { tagsReducer } from "./tags-reducer";
import { TagsState } from "./tags-types";

jest.mock("uuid/v4", () => jest.fn());

const setup = ({ mockTagId = "" } = {}) => {
  uuid.mockReset();
  if (mockTagId !== "") {
    uuid.mockReturnValue(mockTagId);
  }
};

describe("database-reducer", () => {
  describe("RESET_TAGS", () => {
    const initialState: TagsState = {
      tags: {
        tagId: {
          ffIds: ["ffId"],
          id: "tagId",
          name: "tag-name"
        }
      }
    };

    it("should reset the state to an empty store", () => {
      const nextState = tagsReducer(initialState, resetTags());

      expect(nextState).toEqual({
        tags: {}
      });
    });
  });

  describe("INITIALIZE_TAGS", () => {
    const initialState: TagsState = {
      tags: {}
    };

    it("should replace the state with the provided tagMap", () => {
      const firstId = "id1";
      const tags = {
        [firstId]: {
          ffIds: ["ff1", "ff2"],
          id: firstId,
          name: "name"
        }
      };

      expect(tagsReducer(initialState, initializeTags(tags))).toEqual({
        tags
      });
    });
  });

  describe("ADD_TAG", () => {
    const initialState: TagsState = {
      tags: {}
    };
    describe("with a generated id", () => {
      it("should add the tag to the map", () => {
        const tagName = "test-tag";
        const ffId = "test-folder";
        const tagId = "tag-id";

        setup({ mockTagId: tagId });

        const nextState = tagsReducer(initialState, addTag(tagName, ffId));
        expect(nextState).toEqual({
          tags: {
            [tagId]: {
              ffIds: [ffId],
              id: tagId,
              name: tagName
            }
          }
        });
      });
    });

    describe("with a set id", () => {
      it("should add the tag to the map", () => {
        const tagName = "test-tag";
        const ffId = "test-folder";
        const tagId = "tag-id";

        setup();

        const nextState = tagsReducer(
          initialState,
          addTag(tagName, ffId, tagId)
        );
        expect(nextState).toEqual({
          tags: {
            [tagId]: {
              ffIds: [ffId],
              id: tagId,
              name: tagName
            }
          }
        });
      });
    });

    describe("whith an already existing name", () => {
      it("should add the ffid and not create a new tag", () => {
        const tagName = "alreadyExisting";
        const tagId = "initialTagId";
        const existingFfId = "existingFfId";
        const newFfId = "newFfId";

        const baseState = {
          tags: {
            [tagId]: {
              ffIds: [existingFfId],
              id: tagId,
              name: tagName
            }
          }
        };

        const nextState = tagsReducer(baseState, addTag(tagName, newFfId));

        expect(nextState).toEqual({
          tags: {
            [tagId]: {
              ffIds: [existingFfId, newFfId],
              id: tagId,
              name: tagName
            }
          }
        });
      });
    });
  });

  describe("RENAME_TAG", () => {
    it("should change the name of the preexisting tag", () => {
      const tagId = "testId";
      const newName = "newName";
      const ffIds = ["test-ffid"];
      const initialState = {
        tags: {
          [tagId]: {
            ffIds,
            id: tagId,
            name: "baseName"
          }
        }
      };

      const nextState = tagsReducer(initialState, renameTag(tagId, newName));

      expect(nextState).toEqual({
        tags: {
          [tagId]: {
            ffIds,
            id: tagId,
            name: newName
          }
        }
      });
    });
  });

  describe("DELETE_TAG", () => {
    it("should remove the tag from the state", () => {
      const tagId = "testId";
      const initialState = {
        tags: {
          [tagId]: {
            ffIds: ["test-ffid"],
            id: tagId,
            name: "baseName"
          }
        }
      };

      const nextState = tagsReducer(initialState, deleteTag(tagId));

      expect(nextState).toEqual({ tags: {} });
    });
  });

  describe("TAG_FILE", () => {
    it("should add the ffId to the ffIds set of the corresponding tag", () => {
      const tagId = "tag-id";
      const existingFfid = "existing-ffid";
      const ffId = "new-ffid";
      const tagName = "baseName";
      const initialState = {
        tags: {
          [tagId]: {
            ffIds: [existingFfid],
            id: tagId,
            name: tagName
          }
        }
      };

      const nextState = tagsReducer(initialState, tagFile(tagId, ffId));

      expect(nextState).toEqual({
        tags: {
          [tagId]: {
            ffIds: [existingFfid, ffId],
            id: tagId,
            name: tagName
          }
        }
      });
    });
    it("should keep only one version of a ffId if it is already present", () => {
      const tagId = "tag-id";
      const existingFfid = "existing-ffid";
      const tagName = "baseName";
      const initialState = {
        tags: {
          [tagId]: {
            ffIds: [existingFfid],
            id: tagId,
            name: tagName
          }
        }
      };

      const nextState = tagsReducer(initialState, tagFile(tagId, existingFfid));

      expect(nextState).toEqual({
        tags: {
          [tagId]: {
            ffIds: [existingFfid],
            id: tagId,
            name: tagName
          }
        }
      });
    });
  });

  describe("UNTAG_FILE", () => {
    it("should remove the ffId to the ffIds set of the corresponding tag", () => {
      const tagId = "tag-id";
      const existingFfid = "existing-ffid";
      const ffIdToRemove = "ffid-to-remove";
      const tagName = "baseName";
      const initialState = {
        tags: {
          [tagId]: {
            ffIds: [existingFfid, ffIdToRemove],
            id: tagId,
            name: tagName
          }
        }
      };

      const nextState = tagsReducer(
        initialState,
        untagFile(tagId, ffIdToRemove)
      );

      expect(nextState).toEqual({
        tags: {
          [tagId]: {
            ffIds: [existingFfid],
            id: tagId,
            name: tagName
          }
        }
      });
    });
  });
});
