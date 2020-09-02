import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import ElementCharacteristicsContent, {
  ElementCharacteristicsContentProps,
} from "./element-characteristics-content";
import NoElementSelectedPlaceholder from "./no-element-selected-placeholder";

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
}) => {
  const { t } = useTranslation();
  return elementName === "" ? (
    <NoElementSelectedPlaceholder title={t("report.noElementSelected")} />
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
};

export default ElementCharacteristics;
