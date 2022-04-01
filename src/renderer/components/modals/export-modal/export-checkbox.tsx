import type { CheckboxProps } from "@material-ui/core/Checkbox";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
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
    (event) => {
      setActiveExportValue(event.target.checked);
    },
    [setActiveExportValue]
  );

  return (
    <FormControlLabel
      disabled={!isActive}
      control={<Checkbox onChange={onChange} checked={checked} />}
      label={`${label}${
        !isActive && disabledExplanation ? ` (${disabledExplanation})` : ""
      }`}
    />
  );
};
