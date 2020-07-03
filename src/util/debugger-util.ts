import { useEffect, useRef } from "react";

/**
 * Hook that logs props that change since last render
 * @param props - The props to monitor
 */
export const useLogPropChange = (props) => {
  const testRef = useRef({});
  useEffect(() => {
    const changedElements = Object.keys(testRef.current).filter(
      (key) => props[key] !== testRef.current[key]
    );

    console.log(changedElements);
    testRef.current = props;
  }, Object.entries(props));
};
