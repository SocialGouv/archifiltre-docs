import React, { ReactNode, useState } from "react";
import Box from "@material-ui/core/Box";
import { Menu, MenuItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { FaCheck } from "react-icons/fa";

type OptionValue = string | number;

type Option<ValueType extends OptionValue> = {
  value: ValueType;
  label: string;
};

type OptionsPickerProps<ValueType extends OptionValue> = {
  title?: string;
  value: ValueType;
  setValue: (value: ValueType) => void;
  options: Option<ValueType>[];
  icon?: ReactNode;
};

export default function OptionsPicker<ValueType extends OptionValue>({
  title,
  value,
  setValue,
  options,
  icon = null,
}: OptionsPickerProps<ValueType>) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onItemClick = (index) => {
    const selectedOption = options[index];
    setValue(selectedOption.value);
    handleClose();
  };
  return (
    <Box>
      <Button
        aria-controls="options-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="outlined"
        disableElevation={true}
        color="secondary"
        size="small"
        startIcon={icon}
      >
        {title}
      </Button>
      <Menu
        getContentAnchorEl={null}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {options.map(({ value: optionValue, label }, index) => (
          <MenuItem
            key={optionValue}
            onClick={() => onItemClick(index)}
            value={value}
          >
            {optionValue === value && (
              <Box paddingRight={1}>
                <FaCheck />
              </Box>
            )}
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
