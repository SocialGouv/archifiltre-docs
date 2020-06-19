import React, { FC } from "react";
import ElementCharacteristicsContent, {
  ElementCharacteristicsContentProps,
} from "./element-characteristics-content";
import ElementCharacteristicsPlaceholder from "./element-characteristics-placeholder";

const ElementCharacteristics: FC<ElementCharacteristicsContentProps> = ({
  elementName,
  elementAlias,
  elementSize,
  elementPath,
  hash,
  isFolder,
  minLastModifiedTimestamp,
  maxLastModifiedTimestamp,
  medianLastModifiedTimestamp,
  onElementNameChange,
  type,
}) =>
  elementName === "" ? (
    <ElementCharacteristicsPlaceholder />
  ) : (
    <ElementCharacteristicsContent
      elementName={elementName}
      elementAlias={elementAlias}
      elementSize={elementSize}
      elementPath={elementPath}
      minLastModifiedTimestamp={minLastModifiedTimestamp}
      maxLastModifiedTimestamp={maxLastModifiedTimestamp}
      medianLastModifiedTimestamp={medianLastModifiedTimestamp}
      hash={hash}
      isFolder={isFolder}
      onElementNameChange={onElementNameChange}
      type={type}
    />
  );

export default ElementCharacteristics;
