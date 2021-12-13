import type { DependencyList } from "react";
import { useEffect, useState } from "react";

/**
 * Like useMemo, but defers the value computation after the first render.
 * @param factory - The value factory
 * @param dependencies - The factory dependencies
 */
export const useDeferredMemo = <T>(
  factory: () => T,
  dependencies: DependencyList
): T | null => {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(factory());
    });
    return () => {
      clearTimeout(timer);
    };
  }, [...dependencies, setValue]);

  return value;
};
