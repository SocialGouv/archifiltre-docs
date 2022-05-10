import type { MouseEvent } from "react";
import { useCallback, useRef } from "react";

export type MoveElement = (
  movedElementId: string,
  targetFolderId: string
) => void;

interface MovableElement {
  onIcicleMouseDown: (event: MouseEvent) => void;
  onIcicleMouseUp: (event: MouseEvent) => void;
}

/**
 * Hook to handle drag and drop of icicle elements
 * Elements with a data-draggable-id attribute will be considered draggable
 * @param onElementMoved - The callback called when an element is moved
 */
export const useMovableElements = (
  onElementMoved: MoveElement
): MovableElement => {
  const draggedElementRef = useRef("");

  const onIcicleMouseDown = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      draggedElementRef.current =
        target.attributes.getNamedItem("data-draggable-id")?.value ?? "";
    },
    [draggedElementRef]
  );

  const onIcicleMouseUp = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const releasedOnId =
        target.attributes.getNamedItem("data-draggable-id")?.value ?? "";
      const movedElement = draggedElementRef.current;
      if (
        releasedOnId !== "" &&
        releasedOnId !== draggedElementRef.current &&
        movedElement !== ""
      ) {
        onElementMoved(movedElement, releasedOnId);
        draggedElementRef.current = "";
      }
    },
    [draggedElementRef, onElementMoved]
  );

  return { onIcicleMouseDown, onIcicleMouseUp };
};
