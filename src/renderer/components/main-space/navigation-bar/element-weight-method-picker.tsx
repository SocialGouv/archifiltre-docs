import React from "react";
import { useTranslation } from "react-i18next";
import { FaWeightHanging } from "react-icons/fa";

import { ElementWeightMethod } from "../../../reducers/icicle-sort-method/icicle-sort-method-types";
import { OptionsPicker } from "./options-picker";

export interface ElementWeightMethodPickerProps {
  elementWeightMethod: ElementWeightMethod;
  setElementWeightMethod: (method: ElementWeightMethod) => void;
}

export const ElementWeightMethodPicker: React.FC<
  ElementWeightMethodPickerProps
> = ({ setElementWeightMethod, elementWeightMethod }) => {
  const { t } = useTranslation();

  const options = [
    {
      label: t("workspace.bySize"),
      value: ElementWeightMethod.BY_VOLUME,
    },
    {
      label: t("workspace.byNumber"),
      value: ElementWeightMethod.BY_FILE_COUNT,
    },
  ];
  return (
    <OptionsPicker
      title={t("workspace.weight")}
      value={elementWeightMethod}
      setValue={setElementWeightMethod}
      options={options}
      icon={<FaWeightHanging />}
    />
  );
};
