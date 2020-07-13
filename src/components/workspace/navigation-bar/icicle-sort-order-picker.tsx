import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";
import OptionsPicker from "components/workspace/navigation-bar/options-picker";

interface IciclesSortOrderPickerProps {
  icicleSortMethod: IcicleSortMethod;
  setIcicleSortMethod: (sortMethod: IcicleSortMethod) => void;
}

const IciclesSortOrderPicker: FC<IciclesSortOrderPickerProps> = ({
  icicleSortMethod,
  setIcicleSortMethod,
}) => {
  const { t } = useTranslation();

  const options = [
    {
      value: IcicleSortMethod.SORT_BY_SIZE,
      label: t("workspace.bySize"),
    },
    {
      value: IcicleSortMethod.SORT_BY_DATE,
      label: t("workspace.dates"),
    },
    {
      value: IcicleSortMethod.SORT_ALPHA_NUMERICALLY,
      label: t("workspace.alphanumeric"),
    },
  ];
  return (
    <OptionsPicker
      value={icicleSortMethod}
      setValue={setIcicleSortMethod}
      options={options}
    />
  );
};

export default IciclesSortOrderPicker;
