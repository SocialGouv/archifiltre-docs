import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import type { SelectProps } from "@material-ui/core/Select";
import Select from "@material-ui/core/Select";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

export interface FilterProps {
  availableOptions: string[];
  name: string;
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
}

export const Filter: React.FC<FilterProps> = ({
  name,
  availableOptions,
  selectedOptions,
  setSelectedOptions,
}) => {
  const { t } = useTranslation();

  const handleChange: NonNullable<SelectProps["onChange"]> = useCallback(
    (event) => {
      setSelectedOptions(event.target.value as string[]);
    },
    [setSelectedOptions]
  );

  return (
    <Box>
      <Box paddingBottom={1}>
        <InputLabel>{name}</InputLabel>
      </Box>
      <Select
        multiple
        fullWidth
        value={selectedOptions}
        renderValue={(selected) => (selected as string[]).join(", ")}
        onChange={handleChange}
        input={<Input />}
        disableUnderline={true}
        MenuProps={{
          anchorOrigin: {
            horizontal: "center",
            vertical: "bottom",
          },
          getContentAnchorEl: null,
          style: { maxHeight: "80vh" },
          transformOrigin: {
            horizontal: "center",
            vertical: "top",
          },
        }}
      >
        {availableOptions.length === 0 ? (
          <option disabled>{t("search.noAvailableOption")}</option>
        ) : (
          availableOptions.map((option, index) => (
            <MenuItem key={`${name}-${index}-${option}`} value={option}>
              <Checkbox checked={selectedOptions.includes(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))
        )}
      </Select>
    </Box>
  );
};
