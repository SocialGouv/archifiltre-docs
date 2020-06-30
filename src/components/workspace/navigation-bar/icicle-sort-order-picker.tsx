import Select from "@material-ui/core/Select";
import React, { FC, useCallback } from "react";

import { useTranslation } from "react-i18next";
import { IciclesSortMethod } from "reducers/workspace-metadata/workspace-metadata-types";

interface IciclesSortOrderPickerProps {
  iciclesSortMethod: IciclesSortMethod;
  setIciclesSortMethod: (sortMethod: IciclesSortMethod) => void;
}

const IciclesSortOrderPicker: FC<IciclesSortOrderPickerProps> = ({
  iciclesSortMethod,
  setIciclesSortMethod,
}) => {
  const { t } = useTranslation();

  const handleChange = useCallback((event) => {
    setIciclesSortMethod(event.target.value);
  }, []);

  return (
    <Select
      native
      value={iciclesSortMethod}
      onChange={handleChange}
      disableUnderline={true}
    >
      <option value={IciclesSortMethod.SORT_BY_TYPE}>
        {t("workspace.type")}
      </option>
      <option value={IciclesSortMethod.SORT_BY_DATE}>
        {t("workspace.dates")}
      </option>
      <option value={IciclesSortMethod.SORT_ALPHA_NUMERICALLY}>
        {t("workspace.alphanumeric")}
      </option>
    </Select>
  );
};

export default IciclesSortOrderPicker;
