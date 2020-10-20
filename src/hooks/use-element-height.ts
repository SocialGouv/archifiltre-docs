import { MutableRefObject, useCallback, useEffect, useState } from "react";

export const useElementHeight = (
  ref: MutableRefObject<HTMLElement | null>
): number => {
  const [height, setHeight] = useState(0);

  const setElementHeightFromRef = useCallback(
    (element: HTMLElement) => {
      const { height: refHeight } = element.getBoundingClientRect();
      setHeight(refHeight);
    },
    [setHeight]
  );

  useEffect(() => {
    if (ref.current) {
      setElementHeightFromRef(ref.current);
    }
  }, [ref, setElementHeightFromRef]);

  useEffect(() => {
    const onResize = () => {
      if (ref.current) {
        setElementHeightFromRef(ref.current);
      }
    };
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [ref, setElementHeightFromRef]);

  return height;
};
