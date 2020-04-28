import { Checkbox, Input, ListItemText, Select } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import React, { FC, useCallback } from "react";
import { useStyles } from "hooks/use-styles";

interface FilterProps {
  name: string;
  availableOptions: string[];
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
}

const Filter: FC<FilterProps> = ({
  name,
  availableOptions,
  selectedOptions,
  setSelectedOptions,
}) => {
  const classes = useStyles();

  const handleChange = useCallback(
    (event) => {
      setSelectedOptions(event.target.value);
    },
    [setSelectedOptions]
  );

  return (
    <Select
      multiple
      fullWidth
      value={selectedOptions}
      renderValue={(selected: string[]) => selected.join(", ")}
      onChange={handleChange}
      input={<Input />}
      className={classes.select}
      label={name}
    >
      {availableOptions.map((option, index) => (
        <MenuItem key={`${name}-${index}-${option}`} value={option}>
          <Checkbox checked={selectedOptions.indexOf(option) > -1} />
          <ListItemText primary={option} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default Filter;
