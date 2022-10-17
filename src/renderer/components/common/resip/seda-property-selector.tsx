import { MenuItem } from "@material-ui/core";
import type { SelectProps } from "@material-ui/core/Select";
import Select from "@material-ui/core/Select";
import type { FC } from "react";
import React from "react";

import type { SedaField } from "../../../reducers/seda-configuration/seda-configuration-type";
import { sedaFields } from "../../../reducers/seda-configuration/seda-configuration-type";

export interface SedaPropertySelectorProps {
  onChange?: (value: SedaField) => void;
  value?: SedaField;
}

const isSedaField = (value: unknown): value is SedaField =>
  typeof value === "string" && (sedaFields as string[]).includes(value);

export const SedaPropertySelector: FC<SedaPropertySelectorProps> = ({
  onChange,
  value,
}) => {
  const selectChangeHandler: SelectProps["onChange"] = (event) => {
    const newValue = event.target.value;
    if (isSedaField(newValue)) {
      onChange?.(newValue);
    }
  };
  return (
    <Select value={value ?? ""} onChange={selectChangeHandler}>
      {sedaFields.map((label) => (
        <MenuItem key={label} value={label}>
          {label}
        </MenuItem>
      ))}
      <MenuItem value="">Aucun</MenuItem>
    </Select>
  );
};
