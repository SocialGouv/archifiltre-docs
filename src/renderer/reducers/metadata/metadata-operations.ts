import { groupBy, identity, isUndefined, uniqBy } from "lodash";

import type {
  EntityId,
  EntityMetadataIndex,
  Metadata,
  MetadataContext,
  MetadataDto,
  MetadataId,
  MetadataMap,
} from "./metadata-types";

const createMetadataEntity = (
  context: MetadataContext,
  metadata: MetadataDto
): { context: MetadataContext; metadataEntity: Metadata } => {
  return {
    context: {
      ...context,
      id: context.id + 1,
    },
    metadataEntity: {
      ...metadata,
      id: context.id,
    },
  };
};

const addMetadataToEntityIndex = (
  index: EntityMetadataIndex,
  metadatas: Metadata[]
) => {
  const newMap = new Map(index);

  metadatas.forEach((metadata) => {
    const existingData = newMap.get(metadata.entity);

    if (existingData) {
      newMap.set(metadata.entity, [...existingData, metadata.id]);
    } else {
      newMap.set(metadata.entity, [metadata.id]);
    }
  });

  return newMap;
};

const deleteMetadataFromEntityIndex = (
  index: EntityMetadataIndex,
  metadata: Metadata
) => {
  const newIndex = new Map(index);

  const existingIndex = newIndex.get(metadata.entity);

  if (!existingIndex) {
    return newIndex;
  }

  newIndex.set(
    metadata.entity,
    existingIndex.filter((metadataId) => metadataId !== metadata.id)
  );

  return newIndex;
};

const addMetadataToMap = (map: MetadataMap, metadatas: Metadata[]) => {
  const newMap = new Map(map);

  metadatas.forEach((metadata) => {
    newMap.set(metadata.id, metadata);
  });

  return newMap;
};

const deleteMetadataFromMap = (map: MetadataMap, metadata: Metadata) => {
  const newMap = new Map(map);

  newMap.delete(metadata.id);

  return newMap;
};

const updateMetadataInMap = (
  map: MetadataMap,
  metadataId: MetadataId,
  metadata: Partial<MetadataDto>
) => {
  const newMap = new Map(map);

  const existingMetadata = newMap.get(metadataId);

  if (!existingMetadata) {
    throw new Error("Cannot update non-existing metadata");
  }

  newMap.set(metadataId, {
    ...existingMetadata,
    ...metadata,
  });

  return newMap;
};

export const createMetadataContext = (): MetadataContext => ({
  entityMetadataIndex: new Map<EntityId, MetadataId[]>(),
  id: 0,
  metadata: new Map<MetadataId, Metadata>(),
});

export const addMetadata = (
  context: MetadataContext,
  metadata: MetadataDto
): { context: MetadataContext; metadataId: MetadataId } => {
  const { metadataEntity, context: newContext } = createMetadataEntity(
    context,
    metadata
  );

  return {
    context: {
      ...newContext,
      entityMetadataIndex: addMetadataToEntityIndex(
        newContext.entityMetadataIndex,
        [metadataEntity]
      ),
      metadata: addMetadataToMap(newContext.metadata, [metadataEntity]),
    },
    metadataId: metadataEntity.id,
  };
};

const createBatchMetadata = (
  inputContext: MetadataContext,
  metadatas: MetadataDto[]
) =>
  metadatas.reduce<{ context: MetadataContext; metadataEntities: Metadata[] }>(
    ({ context, metadataEntities }, metadata) => {
      const { context: newContext, metadataEntity } = createMetadataEntity(
        context,
        metadata
      );
      return {
        context: newContext,
        metadataEntities: [...metadataEntities, metadataEntity],
      };
    },
    { context: inputContext, metadataEntities: [] }
  );

export const addBatchMetadata = (
  context: MetadataContext,
  metadata: MetadataDto[]
): MetadataContext => {
  const { context: contextAfterCreate, metadataEntities } = createBatchMetadata(
    context,
    metadata
  );

  return {
    ...contextAfterCreate,
    entityMetadataIndex: addMetadataToEntityIndex(
      contextAfterCreate.entityMetadataIndex,
      metadataEntities
    ),
    metadata: addMetadataToMap(contextAfterCreate.metadata, metadataEntities),
  };
};

const isMetadata = (metadata: Metadata | undefined): metadata is Metadata =>
  metadata !== undefined;

export const getMetadataByEntityId = (
  context: MetadataContext,
  entityId: EntityId
): Metadata[] => {
  const metadataIds = context.entityMetadataIndex.get(entityId);

  if (!metadataIds) {
    return [];
  }

  return metadataIds
    .map((metadataId) => context.metadata.get(metadataId))
    .filter(isMetadata);
};

export const getMetadataList = (context: MetadataContext) => {
  return uniqBy([...context.metadata.values()], "name");
};

export const deleteMetadata = (
  context: MetadataContext,
  metadata: Metadata
): MetadataContext => ({
  ...context,
  entityMetadataIndex: deleteMetadataFromEntityIndex(
    context.entityMetadataIndex,
    metadata
  ),
  metadata: deleteMetadataFromMap(context.metadata, metadata),
});

export const updateMetadata = (
  context: MetadataContext,
  metadataId: MetadataId,
  metadata: Partial<MetadataDto>
) => ({
  ...context,
  metadata: updateMetadataInMap(context.metadata, metadataId, metadata),
});

export type IdTransformer = (id: string) => EntityId;

interface RecordsToMedatataOptions {
  entityIdKey: string;
  entityIdTransformer?: IdTransformer;
}

const baseIdTransformer: IdTransformer = identity;

const recordToMetadata = (
  record: Record<string, string>,
  {
    entityIdKey,
    entityIdTransformer = baseIdTransformer,
  }: RecordsToMedatataOptions
): MetadataDto[] => {
  const entity = record[entityIdKey];

  if (isUndefined(entity)) {
    throw new Error("Invalid entity id key");
  }

  return Object.keys(record)
    .filter((key) => key !== entityIdKey)
    .map(
      (key): MetadataDto => ({
        content: record[key],
        entity: entityIdTransformer(record[entityIdKey]),
        name: key,
      })
    );
};

export const recordsToMetadata = (
  records: Record<string, string>[],
  options: RecordsToMedatataOptions
): MetadataDto[] =>
  records.flatMap((record) => recordToMetadata(record, options));

export const getMetadataByEntity = (
  context: MetadataContext
): Record<string, Metadata[]> => {
  const metadataValues = [...context.metadata.values()];

  return groupBy(metadataValues, "entity");
};
