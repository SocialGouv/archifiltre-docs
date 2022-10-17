import { mapValues } from "lodash";
import { useDispatch, useSelector } from "react-redux";

import { getMetadataByEntity } from "../metadata/metadata-operations";
import { getMetadataContextFromState } from "../metadata/metadata-selector";
import type { Metadata } from "../metadata/metadata-types";
import type { StoreState } from "../store";
import { setSedaMappingAction } from "./seda-configuration-action";
import type {
  ActiveSedaFields,
  SedaField,
  SedaMetadataMapping,
} from "./seda-configuration-type";

export const getSedaState = (state: StoreState) => state.sedaConfiguration;

interface SedaMetadata {
  content: string;
  entity: string;
  id: number;
  name: SedaField;
}

type SedaMetadataMap = Record<string, SedaMetadata[]>;

export const getMetadataMapping = (state: StoreState) =>
  getSedaState(state).metadataMapping;

export const getSedaMetadata = (state: StoreState): SedaMetadataMap => {
  const mapping = getMetadataMapping(state);
  const metadataByEntity = getMetadataByEntity(
    getMetadataContextFromState(state)
  );

  return mapValues(metadataByEntity, (metadatas: Metadata[]) =>
    metadatas
      .map((metadata) => ({
        ...metadata,
        name: mapping[metadata.name],
      }))
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      .filter(({ name }) => name !== undefined)
  );
};

export const getActiveSedaFields = (
  sedaMetadata: SedaMetadataMap
): ActiveSedaFields => {
  const fields = new Set<string>();
  const tags = new Set<string>();
  Object.values(sedaMetadata)
    .flat()
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

export const useSedaMapping = (): [
  SedaMetadataMapping,
  (mapping: SedaMetadataMapping) => void
] => {
  const mapping = useSelector(getMetadataMapping);
  const dispatch = useDispatch();

  const setMapping = (newMapping: SedaMetadataMapping) =>
    dispatch(setSedaMappingAction(newMapping));

  return [mapping, setMapping];
};

export const isTagMetadata = (metadata: Metadata) => metadata.name === "Tags";
