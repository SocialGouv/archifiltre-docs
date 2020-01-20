import BreadCrumbPoly from "./breadcrumb-poly";
import BreadCrumbText from "./breadcrumb-text";
import React, { useCallback } from "react";
import { decomposePathToElement } from "../../../reducers/files-and-folders/files-and-folders-selectors";

export const ActiveBreadcrumb = ({
  style,
  fillColor,
  nodeId,
  displayName,
  dim,
  isFirst,
  isLast,
  opacity,
  icicleState
}) => {
  const onClickHandler = useCallback(
    event => {
      event.stopPropagation();
      icicleState.lock(decomposePathToElement(nodeId), {
        x: dim.x_poly,
        y: dim.y_poly,
        dx: dim.width_poly,
        dy: dim.height_poly
      });
    },
    [
      dim.height_poly,
      dim.width_poly,
      dim.x_poly,
      dim.y_poly,
      icicleState,
      nodeId
    ]
  );

  return (
    <g style={style} onClick={onClickHandler}>
      <BreadCrumbPoly
        isLast={isLast}
        isFirst={isFirst}
        x={dim.x_poly}
        y={dim.y_poly}
        dx={dim.width_poly}
        dy={dim.height_poly}
        fillColor={fillColor}
        opacity={opacity}
      />
      <BreadCrumbText
        x={dim.x_text}
        y={dim.y_text}
        dx={dim.width_text}
        dy={dim.height_text}
        text={displayName}
        isPlaceholder={false}
      />
    </g>
  );
};
