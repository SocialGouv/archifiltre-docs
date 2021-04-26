import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";
import OptionsPicker from "./options-picker";
import { FaSortAmountDown } from "react-icons/fa";

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
      title={t("workspace.ordering")}
      value={icicleSortMethod}
      setValue={setIcicleSortMethod}
      options={options}
      icon={<FaSortAmountDown />}
    />
  );
};

export default IciclesSortOrderPicker;
