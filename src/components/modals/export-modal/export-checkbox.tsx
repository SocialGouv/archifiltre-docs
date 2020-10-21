import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import React, { FC, useCallback } from "react";

type ExportOptionProps = {
  setActiveExportValue: (value: boolean) => void;
  label: string;
  isActive: boolean;
  disabledExplanation: string;
};

const ExportCheckbox: FC<ExportOptionProps> = ({
  setActiveExportValue,
  label,
  isActive,
  disabledExplanation,
}) => {
  const onChange = useCallback(
    (event) => {
      setActiveExportValue(event.target.checked);
    },
    [setActiveExportValue]
  );

  return (
    <FormControlLabel
      disabled={!isActive}
      control={<Checkbox onChange={onChange} />}
      label={`${label}${
        !isActive && disabledExplanation ? ` (${disabledExplanation})` : ""
      }`}
    />
  );
};

export default ExportCheckbox;
