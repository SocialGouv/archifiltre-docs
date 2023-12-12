import type { ObjectIterator } from "lodash";
import { mapValues } from "lodash";

import { getMetadataByEntity } from "../metadata/metadata-operations";
import { getMetadataContextFromState } from "../metadata/metadata-selector";
import type { Metadata, MetadataByEntity } from "../metadata/metadata-types";
import type { StoreState } from "../store";
import type {
  ActiveSedaFields,
  SedaConfigurationState,
  SedaField,
  SedaMetadata,
  SedaMetadataMap,
} from "./seda-configuration-type";
import { sedaFields } from "./seda-configuration-type";

export const getSedaState = (state: StoreState): SedaConfigurationState =>
  state.sedaConfiguration;

const isSedaField = (value: string): value is SedaField =>
  sedaFields.includes(value as SedaField);

const isSedaMetadata = (value: Metadata): value is SedaMetadata =>
  isSedaField(value.name);

export const getMetadataMapping = (state: StoreState) =>
  getSedaState(state).metadataMapping;

export const getSedaMetadata = (state: StoreState): SedaMetadataMap => {
  const mapping = getMetadataMapping(state);
  const metadataByEntity = getMetadataByEntity(
    getMetadataContextFromState(state)
  );

  const updateMetadata: ObjectIterator<MetadataByEntity, SedaMetadata[]> = (
    metadatas: Metadata[] | undefined
  ) =>
    metadatas
      ?.map((metadata) => ({
        ...metadata,
        name: mapping[metadata.name] ?? "",
      }))
      .filter(isSedaMetadata)
      .filter(({ name }) => name) ?? [];

  return mapValues<MetadataByEntity, SedaMetadata[]>(
    metadataByEntity,
    updateMetadata
  );
};

export const getActiveSedaFields = (
  sedaMetadata: SedaMetadataMap
): ActiveSedaFields => {
  const fields = new Set<string>();
  const tags = new Set<string>();
  Object.values(sedaMetadata)
    .flat()
    .filter((metadata): metadata is SedaMetadata => metadata !== undefined)
    .forEach((metadata) => {
      if (metadata.name === "Tags") {
        tags.add(metadata.content);
      }

      fields.add(metadata.name);
    });

  return {
    fields,
    tags,
  };
};

export const isTagMetadata = (metadata: Metadata) => metadata.name === "Tags";
