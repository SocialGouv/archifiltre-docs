import Select from "@material-ui/core/Select";
import React, { FC, useCallback } from "react";

import { useTranslation } from "react-i18next";
import { useStyles } from "hooks/use-styles";
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
  const classes = useStyles();

  const handleChange = useCallback((event) => {
    setIciclesSortMethod(event.target.value);
  }, []);

  return (
    <Select
      native
      value={iciclesSortMethod}
      onChange={handleChange}
      className={classes.select}
    >
      <option value={IciclesSortMethod.SORT_BY_TYPE}>
        {t("workspace.type")}
      </option>
      <option value={IciclesSortMethod.SORT_BY_DATE}>
        {t("workspace.dates")}
      </option>
    </Select>
  );
};

export default IciclesSortOrderPicker;
