import Box from "@mui/material/Box";
import Button, { type ButtonProps } from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { type ReactNode, useState } from "react";
import { FaCheck } from "react-icons/fa";

type OptionValue = number | string;

interface Option<TValueType extends OptionValue> {
  label: string;
  value: TValueType;
}

interface OptionsPickerProps<TValueType extends OptionValue> {
  icon?: ReactNode;
  options: Array<Option<TValueType>>;
  setValue: (value: TValueType) => void;
  title?: string;
  value: TValueType;
}

export const OptionsPicker = <TValueType extends OptionValue>({
  title,
  value,
  setValue,
  options,
  icon = null,
}: OptionsPickerProps<TValueType>): React.ReactElement<OptionsPickerProps<TValueType>> => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick: ButtonProps["onClick"] = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onItemClick = (index: number) => {
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
          horizontal: "left",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "left",
          vertical: "top",
        }}
      >
        {options.map(({ value: optionValue, label }, index) => (
          <MenuItem
            key={optionValue}
            onClick={() => {
              onItemClick(index);
            }}
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
};
