import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";
import OptionsPicker from "./options-picker";

type IciclesSortOrderPickerProps = {
  icicleSortMethod: IcicleSortMethod;
  setIcicleSortMethod: (sortMethod: IcicleSortMethod) => void;
};

const IciclesSortOrderPicker: FC<IciclesSortOrderPickerProps> = ({
  icicleSortMethod,
  setIcicleSortMethod,
}) => {
  const { t } = useTranslation();

  const options = [
    {
      value: IcicleSortMethod.SORT_BY_SIZE,
      label: t("navigationBar.bySize"),
    },
    {
      value: IcicleSortMethod.SORT_BY_DATE,
      label: t("navigationBar.dates"),
    },
    {
      value: IcicleSortMethod.SORT_ALPHA_NUMERICALLY,
      label: t("navigationBar.alphanumeric"),
    },
  ];
  return (
    <OptionsPicker
      title={t("navigationBar.ordering")}
      value={icicleSortMethod}
      setValue={setIcicleSortMethod}
      options={options}
    />
  );
};

export default IciclesSortOrderPicker;
