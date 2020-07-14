import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { ElementWeightMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";
import OptionsPicker from "components/workspace/navigation-bar/options-picker";

type ElementWeightMethodPickerProps = {
  setElementWeightMethod: (method: ElementWeightMethod) => void;
  elementWeightMethod: ElementWeightMethod;
};

const ElementWeightMethodPicker: FC<ElementWeightMethodPickerProps> = ({
  setElementWeightMethod,
  elementWeightMethod,
}) => {
  const { t } = useTranslation();

  const options = [
    {
      value: ElementWeightMethod.BY_VOLUME,
      label: t("workspace.bySize"),
    },
    {
      value: ElementWeightMethod.BY_FILE_COUNT,
      label: t("workspace.byNumber"),
    },
  ];
  return (
    <OptionsPicker
      title={t("workspace.weight")}
      value={elementWeightMethod}
      setValue={setElementWeightMethod}
      options={options}
    />
  );
};

export default ElementWeightMethodPicker;
