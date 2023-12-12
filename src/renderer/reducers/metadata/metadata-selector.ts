import { useSelector } from "react-redux";

import { getCurrentState } from "../enhancers/undoable/undoable-selectors";
import type { SedaField } from "../seda-configuration/seda-configuration-type";
import type { StoreState } from "../store";
import { getMetadataByEntityId, getMetadataList } from "./metadata-operations";
import type { EntityId, Metadata, MetadataContext } from "./metadata-types";

export const getMetadataContextFromState = (
  state: StoreState
): MetadataContext => getCurrentState(state.metadata).context;

export const useMetadataByEntityId = (entityId: EntityId): Metadata[] =>
  useSelector((state: StoreState) =>
    getMetadataByEntityId(getMetadataContextFromState(state), entityId)
  );

export const useMetadataList = (): Metadata[] =>
  useSelector((state: StoreState) =>
    getMetadataList(getMetadataContextFromState(state))
  );

const getPropFromMetadata =
  (sedaProperty: SedaField) => (metadata: Metadata[] | undefined) =>
    metadata?.find(({ name }) => name === sedaProperty)?.content;

export const getTitleFromMetadata = getPropFromMetadata("Title");

export const getArchivalAgencyArchiveUnitIdentifierFromMetadata =
  getPropFromMetadata("ArchivalAgencyArchiveUnitIdentifier");
