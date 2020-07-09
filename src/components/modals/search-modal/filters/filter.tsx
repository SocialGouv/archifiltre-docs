import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const handleChange = useCallback(
    (event) => {
      setSelectedOptions(event.target.value);
    },
    [setSelectedOptions]
  );

  return (
    <div>
      <InputLabel>{name}</InputLabel>
      <Select
        multiple
        fullWidth
        value={selectedOptions}
        renderValue={(selected: string[]) => selected.join(", ")}
        onChange={handleChange}
        input={<Input />}
        disableUnderline={true}
      >
        {availableOptions.length === 0 ? (
          <option disabled>{t("search.noAvailableOption")}</option>
        ) : (
          availableOptions.map((option, index) => (
            <MenuItem key={`${name}-${index}-${option}`} value={option}>
              <Checkbox checked={selectedOptions.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))
        )}
      </Select>
    </div>
  );
};

export default Filter;
