import Select from "@material-ui/core/Select";
import React, { useCallback } from "react";

type OptionValue = string | number;

type Option<ValueType extends OptionValue> = {
  value: ValueType;
  label: string;
};

interface OptionsPickerProps<ValueType extends OptionValue> {
  value: ValueType;
  setValue: (value: ValueType) => void;
  options: Option<ValueType>[];
}

export default function OptionsPicker<ValueType extends OptionValue>({
  value,
  setValue,
  options,
}: OptionsPickerProps<ValueType>) {
  const handleChange = useCallback(
    (event) => {
      const { selectedIndex } = event.currentTarget;
      const selectedOption = options[selectedIndex];
      setValue(selectedOption.value);
    },
    [value, setValue]
  );
  return (
    <Select
      native
      value={value}
      onChange={handleChange}
      disableUnderline={true}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
}
