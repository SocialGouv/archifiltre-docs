import { debounce, DebouncedFunc } from "lodash";
import { useMemo } from "react";

export const useDebounceCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): DebouncedFunc<T> => useMemo(() => debounce(callback, delay), [callback]);
