import {
  addBatchMetadata,
  addMetadata,
  createMetadataContext, deleteMetadata,
  getMetadataByEntityId, updateMetadata
} from "@renderer/reducers/metadata/metadata-operations";
import {find} from "lodash";
import {MetadataDto, MetadataId} from "@renderer/reducers/metadata/metadata-types";

describe("metadata-operations", () => {
  let context = createMetadataContext();
  
  beforeEach(() => {
    context = createMetadataContext();
  })
  
  describe("getMetadataByEntityId", () => {
    it("should return [] when no metadata exists", () => {
      const metadata = getMetadataByEntityId(context, "entityId");
      
      expect(metadata).toEqual([]);
    });

    it("should return a single existing metadata", () => {
      const entityId = "entityId";
      
      let context = createMetadataContext();
      let metadataId: MetadataId;
      
      const metadata = {
        entity: entityId,
        name: "name",
        content: "content"
      };

      ({ context } = addMetadata(context, metadata));
      const metadatas = getMetadataByEntityId(context, "entityId");

      expect(metadatas.length).toBe(1);
      expect(metadatas).toMatchObject([
        metadata
      ]);
    });

    it("should return multiple existing metadata", () => {
      const entityId = "entityId";
      
      const metadata1 = {
        entity: entityId,
        name: "name1",
        content: "content1"
      };
      
      const metadata2 = {
        entity: entityId,
        name: "name2",
        content: "content2"
      };

      ({ context } = addMetadata(context, metadata1));
      ({ context } = addMetadata(context, metadata2));
      const metadatas = getMetadataByEntityId(context, "entityId");

      expect(metadatas.length).toBe(2);
      expect(metadatas).toMatchObject([
        metadata1,
        metadata2
      ]);
    });
  });
  
  describe("addMetadata", () => {
    it("should not mutate the old context", () => {
      addMetadata(context, {
        entity: "a",
        name: "a",
        content: "a"
      });
      
      expect(context).toEqual(createMetadataContext());
    });
  });
  
  describe("deleteMetadata", () => {
    it("should delete a metadata", () => {
      const deletedMetadata = {
        entity: "a",
        name: "a",
        content: "a"
      };
      
      const remainingMetadata = {
        entity: "a",
        name: "b",
        content: "b"
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
      expect(currentMetadata).toMatchObject([
        remainingMetadata
      ]);
    });
  });
  
  describe("updateMetadata", () => {
    it("should update existing metadata", () => {
      const baseMetadata = {
        name: "a",
        content: "b",
        entity: "a"
      };
      let metadataId;
      
      ({ context, metadataId } = addMetadata(context, baseMetadata));
      context = updateMetadata(context, metadataId, { content: "newContent" });
      
      const metadata = getMetadataByEntityId(context, "a");
      
      expect(metadata[0]).toMatchObject({
        ...baseMetadata,
        content: "newContent"
      });
    });
  });
  
  describe("addBatchMetadata", () => {
    it("should add multiple metadata to the context", () => {
      const metadata: MetadataDto[] = [
        {
          name: "A",
          content: "B",
          entity: "A"
        },
        {
          name: "C",
          content: "D",
          entity: "A"
        },
        {
          name: "A",
          content: "D",
          entity: "B"
        },
      ];
      context = addBatchMetadata(context, metadata);
      
      expect(getMetadataByEntityId(context, "A")).toMatchObject([
        {
          name: "A",
          content: "B",
          entity: "A"
        },
        {
          name: "C",
          content: "D",
          entity: "A"
        }
      ]);

      expect(getMetadataByEntityId(context, "B")).toMatchObject([
        {
          name: "A",
          content: "D",
          entity: "B"
        }
      ])
    });
  });
});
