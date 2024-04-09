import Checkbox, { type CheckboxProps } from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React, { useCallback } from "react";

export interface ExportCheckboxProps {
  checked: boolean;
  disabledExplanation: string;
  isActive: boolean;
  label: string;
  setActiveExportValue: (value: boolean) => void;
}

export const ExportCheckbox: React.FC<ExportCheckboxProps> = ({
  setActiveExportValue,
  label,
  isActive,
  disabledExplanation,
  checked,
}) => {
  const onChange: NonNullable<CheckboxProps["onChange"]> = useCallback(
    event => {
      setActiveExportValue(event.target.checked);
    },
    [setActiveExportValue],
  );

  return (
    <FormControlLabel
      disabled={!isActive}
      control={<Checkbox onChange={onChange} checked={checked} />}
      label={`${label}${!isActive && disabledExplanation ? ` (${disabledExplanation})` : ""}`}
    />
  );
};
