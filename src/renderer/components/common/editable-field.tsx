import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import type { ChangeEvent, FormEvent, KeyboardEvent, ReactNode } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaPen } from "react-icons/fa";

import { useStyles } from "../../hooks/use-styles";

export interface EditableFieldProps {
  multiline?: boolean;
  trimValue: boolean;
  selectTextOnFocus: boolean;
  submitOnBlur?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rowsMax?: number;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  multiline = false,
  trimValue,
  selectTextOnFocus,
  submitOnBlur = true,
  value,
  onChange,
  placeholder = "",
  rowsMax = 0,
  startAdornment = (
    <InputAdornment position="start">
      <FaPen />
    </InputAdornment>
  ),
  endAdornment,
  ...props
}) => {
  const [isFocused, setFocus] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (inputRef.current && isFocused && selectTextOnFocus) {
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    }
  }, [isFocused, selectTextOnFocus]);

  useEffect(() => {
    setLocalValue(value);
  }, [value, setLocalValue]);

  const blurInput = useCallback(() => {
    inputRef.current?.blur();
  }, [inputRef]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLocalValue(event.target.value);
    },
    [setLocalValue]
  );

  const submitValueChange = useCallback(() => {
    const submittedValue = trimValue ? localValue.trim() : localValue;

    if (submittedValue !== value) {
      onChange(submittedValue);
    }
  }, [localValue, onChange, trimValue, value]);

  const handleSubmit = useCallback(
    (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      blurInput();
      if (!submitOnBlur) {
        submitValueChange();
      }
    },
    [submitValueChange, blurInput, submitOnBlur]
  );

  const handleFocus = useCallback(() => {
    setFocus(true);
  }, [setFocus]);

  const handleBlur = useCallback(() => {
    if (submitOnBlur) {
      submitValueChange();
    }
    setFocus(false);
  }, [setFocus, submitOnBlur, submitValueChange]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        setLocalValue(value);
        setFocus(false);
        blurInput();
      }
    },
    [value, setLocalValue, setFocus, blurInput]
  );

  const classes = useStyles();

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Input
        {...props}
        multiline={multiline}
        type="text"
        inputRef={inputRef}
        fullWidth={true}
        value={localValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyPress}
        disableUnderline={!isFocused}
        placeholder={placeholder}
        rowsMax={rowsMax}
        className={classes.editableField}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
      />
    </form>
  );
};
