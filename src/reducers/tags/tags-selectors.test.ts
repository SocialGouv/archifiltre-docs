import { computeDerived, ff } from "../../datastore/files-and-folders";
import {
  getAllTagIdsForFile,
  getTagByName,
  getTagsByIds,
  getTagSize,
  Order,
  sortTags
} from "./tags-selectors";
import { Tag } from "./tags-types";

describe("tags-selectors", () => {
  describe("getAllTagIdsForFile", () => {
    it("should return all the tags for the defined ffId", () => {
      const ffId = "test-ffid";
      const foundTagID = "foundTagID";
      const secondFoungTagID = "secondFoundTagID";
      const tags = {
        [foundTagID]: {
          ffIds: new Set([ffId, "fakeFFid"]),
          id: "1",
          name: "found"
        },
        unfound: {
          ffIds: new Set(["unwanted", "unwanted2"]),
          id: "2",
          name: "unfound"
        },
        [secondFoungTagID]: {
          ffIds: new Set([ffId, "fakeFFid2"]),
          id: "3",
          name: "found2"
        }
      };

      expect(getAllTagIdsForFile(tags, ffId).sort()).toEqual(
        [foundTagID, secondFoungTagID].sort()
      );
    });
  });

  describe("getTagsByIds", () => {
    it("should return all the tags for the defined ffId", () => {
      const foundTagID = "foundTagID";
      const secondFoungTagID = "secondFoundTagID";
      const foundTag = {
        ffIds: new Set(["fakeFFid"]),
        id: foundTagID,
        name: "found"
      };
      const secondFoundTag = {
        ffIds: new Set(["fakeFFid2"]),
        id: secondFoungTagID,
        name: "found2"
      };

      const tags = {
        [foundTagID]: foundTag,
        unfound: {
          ffIds: new Set(["unwanted", "unwanted2"]),
          id: "unfound",
          name: "unfound"
        },
        [secondFoungTagID]: secondFoundTag
      };

      const tagComparator = (tag1: Tag, tag2: Tag): number =>
        tag2.id > tag1.id ? -1 : 1;
      expect(
        getTagsByIds(tags, [foundTagID, secondFoungTagID, "notInMap"]).sort(
          tagComparator
        )
      ).toEqual([foundTag, secondFoundTag].sort(tagComparator));
    });
  });

  describe("getTagByName", () => {
    it("should return undefined if no tag is found", () => {
      const tagMap = {
        unfound: {
          ffIds: new Set(["unwanted", "unwanted2"]),
          id: "unfound",
          name: "unfound"
        }
      };

      expect(getTagByName(tagMap, "notContained")).toEqual(undefined);
    });

    it("should return the tag if a tag is found", () => {
      const foundTagID = "foundTagID";
      const foundTagName = "foundTagName";
      const foundTag = {
        ffIds: new Set(["fakeFFid"]),
        id: foundTagID,
        name: foundTagName
      };
      const tagMap = {
        [foundTagID]: foundTag,
        unfound: {
          ffIds: new Set(["unwanted", "unwanted2"]),
          id: "unfound",
          name: "unfound"
        }
      };

      expect(getTagByName(tagMap, foundTagName)).toEqual(foundTag);
    });
  });

  describe("sortTags", () => {
    const firstTagId = "3firstTagId";
    const firstTag = {
      ffIds: new Set(["ffid"]),
      id: firstTagId,
      name: "1TagName"
    };

    const secondTagId = "2secondTagId";
    const secondTag = {
      ffIds: new Set(["ffid"]),
      id: secondTagId,
      name: "2TagName"
    };

    const thirdTagId = "1thirdTagId";
    const thirdTag = {
      ffIds: new Set(["ffid"]),
      id: thirdTagId,
      name: "3TagName"
    };
    describe("with default parameter", () => {
      it("should order the tags in asc order based on name field", () => {
        expect(sortTags([secondTag, firstTag, thirdTag], {})).toEqual([
          firstTag,
          secondTag,
          thirdTag
        ]);
      });
    });

    describe("with descending order", () => {
      it("should order the tags in desc order based on name field", () => {
        expect(
          sortTags([secondTag, firstTag, thirdTag], { order: Order.DESC })
        ).toEqual([thirdTag, secondTag, firstTag]);
      });
    });

    describe("based on ID", () => {
      it("should order the tags in asc order based on id field", () => {
        expect(
          sortTags([secondTag, firstTag, thirdTag], { sortParam: "id" })
        ).toEqual([thirdTag, secondTag, firstTag]);
      });
    });
  });

  describe("getTagSize", () => {
    it("should return the sum of the tag sizes", () => {
      const origins = [
        [{ size: 1, lastModified: Date.now() }, "path1"],
        [{ size: 10, lastModified: Date.now() }, "path2"],
        [{ size: 100, lastModified: Date.now() }, "path3/file1"],
        [{ size: 100, lastModified: Date.now() }, "path3/file2"]
      ];

      const filesAndFolders = computeDerived(ff(origins));

      const tag = {
        ffIds: new Set(["path1", "path3"]),
        id: "tagId",
        name: "tagName"
      };

      expect(getTagSize(tag, filesAndFolders)).toEqual(201);
    });
  });
});
