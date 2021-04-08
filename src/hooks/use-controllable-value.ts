import { useState } from "react";

export const useControllableValue = <T>(
  defaultValue: T,
  controlledValue?: T,
  onControlledValueChange?: (value: T) => void
): [T, (value: T) => void] => {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const returnValue = controlledValue ?? innerValue;
  const setReturnValue = onControlledValueChange ?? setInnerValue;
  return [returnValue, setReturnValue];
};
