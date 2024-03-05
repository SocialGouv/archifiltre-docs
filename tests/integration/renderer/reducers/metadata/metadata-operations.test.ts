import {
  addBatchMetadata,
  addMetadata,
  createMetadataContext,
  deleteMetadata,
  getMetadataByEntityId,
  updateMetadata,
} from "@renderer/reducers/metadata/metadata-operations";
import type { MetadataDto } from "@renderer/reducers/metadata/metadata-types";
import { find } from "lodash";

describe("metadata-operations", () => {
  let context = createMetadataContext();

  beforeEach(() => {
    context = createMetadataContext();
  });

  describe("getMetadataByEntityId", () => {
    it("should return [] when no metadata exists", () => {
      const metadata = getMetadataByEntityId(context, "entityId");

      expect(metadata).toEqual([]);
    });

    it("should return a single existing metadata", () => {
      const entityId = "entityId";

      const metadata = {
        content: "content",
        entity: entityId,
        name: "name",
      };

      ({ context } = addMetadata(context, metadata));
      const metadatas = getMetadataByEntityId(context, "entityId");

      expect(metadatas.length).toBe(1);
      expect(metadatas).toMatchObject([metadata]);
    });

    it("should return multiple existing metadata", () => {
      const entityId = "entityId";

      const metadata1 = {
        content: "content1",
        entity: entityId,
        name: "name1",
      };

      const metadata2 = {
        content: "content2",
        entity: entityId,
        name: "name2",
      };

      ({ context } = addMetadata(context, metadata1));
      ({ context } = addMetadata(context, metadata2));
      const metadatas = getMetadataByEntityId(context, "entityId");

      expect(metadatas.length).toBe(2);
      expect(metadatas).toMatchObject([metadata1, metadata2]);
    });
  });

  describe("addMetadata", () => {
    it("should not mutate the old context", () => {
      addMetadata(context, {
        content: "a",
        entity: "a",
        name: "a",
      });

      expect(context).toEqual(createMetadataContext());
    });
  });

  describe("deleteMetadata", () => {
    it("should delete a metadata", () => {
      const deletedMetadata = {
        content: "a",
        entity: "a",
        name: "a",
      };

      const remainingMetadata = {
        content: "b",
        entity: "a",
        name: "b",
      };

      ({ context } = addMetadata(context, deletedMetadata));
      ({ context } = addMetadata(context, remainingMetadata));

      const existingMetadata = getMetadataByEntityId(context, "a");

      const metadataToDelete = find(existingMetadata, { name: "a" });

      if (!metadataToDelete) {
        throw new Error("Metadata not properly inserted");
      }

      context = deleteMetadata(context, metadataToDelete);

      const currentMetadata = getMetadataByEntityId(context, "a");

      expect(currentMetadata.length).toBe(1);
      expect(currentMetadata).toMatchObject([remainingMetadata]);
    });
  });

  describe("updateMetadata", () => {
    it("should update existing metadata", () => {
      const baseMetadata = {
        content: "b",
        entity: "a",
        name: "a",
      };
      let metadataId;

      ({ context, metadataId } = addMetadata(context, baseMetadata));
      context = updateMetadata(context, metadataId, { content: "newContent" });

      const metadata = getMetadataByEntityId(context, "a");

      expect(metadata[0]).toMatchObject({
        ...baseMetadata,
        content: "newContent",
      });
    });
  });

  describe("addBatchMetadata", () => {
    it("should add multiple metadata to the context", () => {
      const metadata: MetadataDto[] = [
        {
          content: "B",
          entity: "A",
          name: "A",
        },
        {
          content: "D",
          entity: "A",
          name: "C",
        },
        {
          content: "D",
          entity: "B",
          name: "A",
        },
      ];
      context = addBatchMetadata(context, metadata);

      expect(getMetadataByEntityId(context, "A")).toMatchObject([
        {
          content: "B",
          entity: "A",
          name: "A",
        },
        {
          content: "D",
          entity: "A",
          name: "C",
        },
      ]);

      expect(getMetadataByEntityId(context, "B")).toMatchObject([
        {
          content: "D",
          entity: "B",
          name: "A",
        },
      ]);
    });
  });
});
