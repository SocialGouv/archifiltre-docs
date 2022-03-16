import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAliasesFromStore,
  getFilesAndFoldersFromStore,
  getRealLastModified,
  isFile,
  useLastModifiedDateOverrides,
} from "../../../../../reducers/files-and-folders/files-and-folders-selectors";
import {
  overrideLastModifiedDateThunk,
  updateAliasThunk,
} from "../../../../../reducers/files-and-folders/files-and-folders-thunks";
import { getFilesAndFoldersMetadataFromStore } from "../../../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { getHashesFromStore } from "../../../../../reducers/hashes/hashes-selectors";
import { useWorkspaceMetadata } from "../../../../../reducers/workspace-metadata/workspace-metadata-selectors";
import { getType } from "../../../../../utils/file-and-folders-utils";
import { getAbsolutePath } from "../../../../../utils/file-system/file-sys-util";
import { ElementCharacteristics } from "./element-characteristics";
import type { ElementCharacteristicsContentProps } from "./element-characteristics-content";

export const ElementCharacteristicsContainer: React.FC = () => {
  const { hoveredElementId, lockedElementId, originalPath } =
    useWorkspaceMetadata();
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );
  const aliases = useSelector(getAliasesFromStore);
  const hashes = useSelector(getHashesFromStore);
  const lastModifiedOverrides = useLastModifiedDateOverrides();

  const dispatch = useDispatch();

  const currentElementId = lockedElementId || hoveredElementId;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const currentElement = filesAndFolders[currentElementId] || null;
  const currentElementMetadata =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    filesAndFoldersMetadata[currentElementId] || null;

  const currentElementName = currentElement.name || "";
  const currentElementAlias = aliases[currentElementId] || "";
  const elementSize = currentElementMetadata.childrenTotalSize || 0;
  const minLastModifiedTimestamp = currentElementMetadata.minLastModified || 0;
  const maxLastModifiedTimestamp = currentElementMetadata.maxLastModified || 0;
  const medianLastModifiedTimestamp =
    currentElementMetadata.medianLastModified || 0;
  const currentElementHash = hashes[currentElementId] ?? "";
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const isFolder = currentElement && !isFile(currentElement);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const type = (currentElement && getType(currentElement)) || "";
  const currentElementPath = getAbsolutePath(originalPath, currentElementId);
  const lastModified = getRealLastModified(
    currentElementId,
    filesAndFolders,
    lastModifiedOverrides
  );

  const updateAlias: ElementCharacteristicsContentProps["onElementNameChange"] =
    useCallback(
      (alias) => {
        dispatch(updateAliasThunk(currentElementId, alias));
      },
      [dispatch, currentElementId]
    );

  const updateLastModifiedDate = useCallback(
    (timestamp: number) => {
      dispatch(overrideLastModifiedDateThunk(currentElementId, timestamp));
    },
    [dispatch, currentElementId]
  );

  return (
    <ElementCharacteristics
      elementName={currentElementName}
      elementAlias={currentElementAlias}
      elementSize={elementSize}
      elementPath={currentElementPath}
      minLastModifiedTimestamp={minLastModifiedTimestamp}
      maxLastModifiedTimestamp={maxLastModifiedTimestamp}
      medianLastModifiedTimestamp={medianLastModifiedTimestamp}
      hash={currentElementHash}
      isFolder={isFolder}
      type={type}
      onElementNameChange={updateAlias}
      lastModified={lastModified}
      onLastModifiedChange={updateLastModifiedDate}
    />
  );
};
