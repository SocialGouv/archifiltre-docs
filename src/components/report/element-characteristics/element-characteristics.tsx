import React, { FC } from "react";
import ElementCharacteristicsContent from "./element-characteristics-content";
import ElementCharacteristicsPlaceholder from "./element-characteristics-placeholder";

interface ElementCharacteristicsProps {
  elementName: string;
  elementAlias: string;
  elementSize: number;
  minLastModifiedTimestamp: number;
  maxLastModifiedTimestamp: number;
  medianLastModifiedTimestamp: number;
  hash: string;
  isFolder: boolean;
  onElementNameChange: (name: string) => void;
  type: string;
}

const ElementCharacteristics: FC<ElementCharacteristicsProps> = ({
  elementName,
  elementAlias,
  elementSize,
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
