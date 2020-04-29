import Select from "@material-ui/core/Select";
import React, { useCallback } from "react";

import { useTranslation } from "react-i18next";
import { useStyles } from "hooks/use-styles";

const ToggleWidthBySize = ({
  api: {
    icicle_state: { toggleChangeWidthBySize, widthBySize },
  },
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleChange = useCallback(
    (event) => {
      if (widthBySize.toString() !== event.target.value)
        toggleChangeWidthBySize();
    },
    [widthBySize]
  );

  return (
    <Select
      native
      value={widthBySize.toString()}
      onChange={handleChange}
      className={classes.select}
    >
      <option value="true">{t("workspace.bySize")}</option>
      <option value="false">{t("workspace.byNumber")}</option>
    </Select>
  );
};

export default ToggleWidthBySize;
