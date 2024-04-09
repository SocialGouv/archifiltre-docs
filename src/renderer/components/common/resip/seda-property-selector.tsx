import { MenuItem } from "@mui/material";
import Select, { type SelectProps } from "@mui/material/Select";
import React, { type FC } from "react";

import { type SedaField, sedaFields } from "../../../reducers/seda-configuration/seda-configuration-type";

export interface SedaPropertySelectorProps {
  onChange?: (value: SedaField) => void;
  value?: SedaField;
}

const isSedaField = (value: unknown): value is SedaField =>
  // @ts-expect-error type assertion
  typeof value === "string" && sedaFields.includes(value);

export const SedaPropertySelector: FC<SedaPropertySelectorProps> = ({ onChange, value }) => {
  const selectChangeHandler: SelectProps["onChange"] = event => {
    const newValue = event.target.value;
    if (isSedaField(newValue)) {
      onChange?.(newValue);
    }
  };
  return (
    <Select value={value ?? ""} onChange={selectChangeHandler}>
      {sedaFields.map(label => (
        <MenuItem key={label} value={label}>
          {label}
        </MenuItem>
      ))}
      <MenuItem value="">Aucun</MenuItem>
    </Select>
  );
};
