import Select from "@material-ui/core/Select";
import React, { FC, useCallback } from "react";

import { useTranslation } from "react-i18next";
import { IcicleSortMethod } from "reducers/icicle-sort-method/icicle-sort-method-types";

interface IciclesSortOrderPickerProps {
  icicleSortMethod: IcicleSortMethod;
  setIcicleSortMethod: (sortMethod: IcicleSortMethod) => void;
}

const IciclesSortOrderPicker: FC<IciclesSortOrderPickerProps> = ({
  icicleSortMethod,
  setIcicleSortMethod,
}) => {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (event) => {
      setIcicleSortMethod(event.target.value);
    },
    [setIcicleSortMethod]
  );

  return (
    <Select
      native
      value={icicleSortMethod}
      onChange={handleChange}
      disableUnderline={true}
    >
      <option value={IcicleSortMethod.SORT_BY_TYPE}>
        {t("workspace.type")}
      </option>
      <option value={IcicleSortMethod.SORT_BY_DATE}>
        {t("workspace.dates")}
      </option>
      <option value={IcicleSortMethod.SORT_ALPHA_NUMERICALLY}>
        {t("workspace.alphanumeric")}
      </option>
    </Select>
  );
};

export default IciclesSortOrderPicker;
