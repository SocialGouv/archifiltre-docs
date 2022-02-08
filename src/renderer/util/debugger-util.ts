import { useEffect, useRef } from "react";

import type { SimpleObject } from "./object/object-util";

/**
 * Hook that logs props that change since last render
 * @param props - The props to monitor
 */
export const useLogPropChange = (props: SimpleObject): void => {
  const testRef = useRef({} as SimpleObject);
  useEffect(() => {
    const changedElements = Object.keys(testRef.current).filter(
      (key) => props[key] !== testRef.current[key]
    );

    console.log(changedElements);
    testRef.current = props;
  }, Object.entries(props));
};
