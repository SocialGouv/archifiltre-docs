import React, { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAliasesFromStore,
  getFilesAndFoldersFromStore,
  getHashesFromStore,
  isFile,
} from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { useWorkspaceMetadata } from "../../../reducers/workspace-metadata/workspace-metadata-selectors";
import ElementCharacteristics from "./element-characteristics";
import { getFilesAndFoldersMetadataFromStore } from "../../../reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { updateAliasThunk } from "../../../reducers/files-and-folders/files-and-folders-thunks";
import { getType } from "../../../util/files-and-folders/file-and-folders-utils";
import { getAbsolutePath } from "../../../util/file-system/file-sys-util";

const ElementCharacteristicsContainer: FC = () => {
  const {
    hoveredElementId,
    lockedElementId,
    originalPath,
  } = useWorkspaceMetadata();
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );
  const aliases = useSelector(getAliasesFromStore);
  const hashes = useSelector(getHashesFromStore);
  const dispatch = useDispatch();

  const currentElementId = lockedElementId || hoveredElementId;

  const currentElement = filesAndFolders[currentElementId] || null;
  const currentElementMetadata =
    filesAndFoldersMetadata[currentElementId] || null;

  const currentElementName = currentElement?.name || "";
  const currentElementAlias = aliases[currentElementId] || "";
  const elementSize = currentElementMetadata?.childrenTotalSize || 0;
  const minLastModifiedTimestamp = currentElementMetadata?.minLastModified || 0;
  const maxLastModifiedTimestamp = currentElementMetadata?.maxLastModified || 0;
  const medianLastModifiedTimestamp =
    currentElementMetadata?.medianLastModified || 0;
  const currentElementHash = hashes[currentElementId] || "";
  const isFolder = currentElement && !isFile(currentElement);
  const type = (currentElement && getType(currentElement)) || "";
  const currentElementPath = getAbsolutePath(originalPath, currentElementId);

  const updateAlias = useCallback(
    (alias) => {
      dispatch(updateAliasThunk(currentElementId, alias));
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
    />
  );
};

export default ElementCharacteristicsContainer;
