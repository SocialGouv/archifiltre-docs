import React from "react";
import { useTranslation } from "react-i18next";
import { FaSortAmountDown } from "react-icons/fa";

import { IcicleSortMethod } from "../../../reducers/icicle-sort-method/icicle-sort-method-types";
import { OptionsPicker } from "./options-picker";

export interface IciclesSortOrderPickerProps {
  icicleSortMethod: IcicleSortMethod;
  setIcicleSortMethod: (sortMethod: IcicleSortMethod) => void;
}

export const IciclesSortOrderPicker: React.FC<IciclesSortOrderPickerProps> = ({
  icicleSortMethod,
  setIcicleSortMethod,
}) => {
  const { t } = useTranslation();

  const options = [
    {
      label: t("workspace.bySize"),
      value: IcicleSortMethod.SORT_BY_SIZE,
    },
    {
      label: t("workspace.dates"),
      value: IcicleSortMethod.SORT_BY_DATE,
    },
    {
      label: t("workspace.alphanumeric"),
      value: IcicleSortMethod.SORT_ALPHA_NUMERICALLY,
    },
  ];
  return (
    <OptionsPicker
      title={t("workspace.ordering")}
      value={icicleSortMethod}
      setValue={setIcicleSortMethod}
      options={options}
      icon={<FaSortAmountDown />}
    />
  );
};
