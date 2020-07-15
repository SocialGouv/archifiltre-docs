import React, { useCallback } from "react";
import Select from "@material-ui/core/Select";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Input from "@material-ui/core/Input";

type OptionValue = string | number;

type Option<ValueType extends OptionValue> = {
  value: ValueType;
  label: string;
};

interface OptionsPickerProps<ValueType extends OptionValue> {
  title?: string;
  value: ValueType;
  setValue: (value: ValueType) => void;
  options: Option<ValueType>[];
}

const useStyles = makeStyles(() => ({
  hidden: {
    position: "absolute",
    opacity: 0,
  },
  disableClick: {
    pointerEvents: "none",
  },
}));

/*
 * In case of a label, we display the label in a Select, with pointer-events: none.
 * Clicks will go through the displayed element and trigger a 0 opacity Select that
 * will allow the user to pick his choice. This seemed like the better looking way to
 * display the label inside the input while keeping native selects.
 */
export default function OptionsPicker<ValueType extends OptionValue>({
  title,
  value,
  setValue,
  options,
}: OptionsPickerProps<ValueType>) {
  const { hidden, disableClick } = useStyles();
  const handleChange = useCallback(
    (event) => {
      const { selectedIndex } = event.currentTarget;
      const selectedOption = options[selectedIndex];
      setValue(selectedOption.value);
    },
    [value, setValue]
  );
  return (
    <Box>
      <Select
        native
        onChange={handleChange}
        value={value}
        disableUnderline={true}
        input={
          <Input
            classes={
              title
                ? {
                    root: hidden,
                  }
                : undefined
            }
          />
        }
      >
        {options.map(({ value, label }) => (
          <option key={`hidden-${value}`} value={value}>
            {label}
          </option>
        ))}
      </Select>
      {title && (
        <Select
          native
          defaultValue="Title"
          disableUnderline={true}
          input={<Input classes={title ? { root: disableClick } : undefined} />}
        >
          <option value="Title">{title}</option>
          {options.map(({ value, label }) => (
            <option key={`displayed-${value}`} value={value}>
              {label}
            </option>
          ))}
        </Select>
      )}
    </Box>
  );
}
