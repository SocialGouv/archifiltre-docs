import BreadCrumbPoly from "./breadcrumb-poly";
import BreadCrumbText from "./breadcrumb-text";
import React, { useCallback } from "react";
import { decomposePathToElement } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { CopyToClipboard } from "../../common/copy-to-clipboard";
import { formatPathForUserSystem } from "../../../util/file-sys-util";

const activeBreadcrumbStyle = { cursor: "pointer" };

export const Breadcrumb = ({
  fillColor,
  nodeId,
  displayName,
  dim: {
    x_poly,
    y_poly,
    width_poly,
    height_poly,
    x_text,
    y_text,
    width_text,
    height_text
  },
  isFirst,
  isLast,
  opacity,
  icicleState,
  originalPath,
  isActive
}) => {
  const onClickHandler = useCallback(
    event => {
      if (!isActive) {
        return;
      }
      event.stopPropagation();
      icicleState.lock(decomposePathToElement(nodeId), {
        x: x_poly,
        y: y_poly,
        dx: width_poly,
        dy: height_poly
      });
    },
    [height_poly, width_poly, x_poly, y_poly, icicleState, nodeId, isActive]
  );

  const basePath = originalPath.substring(0, originalPath.lastIndexOf("/"));
  const stringToCopy = formatPathForUserSystem(`${basePath}/${nodeId}`);

  return (
    <g style={isActive ? activeBreadcrumbStyle : {}} onClick={onClickHandler}>
      <BreadCrumbPoly
        isLast={isLast}
        isFirst={isFirst}
        x={x_poly}
        y={y_poly}
        dx={width_poly}
        dy={height_poly}
        fillColor={fillColor}
        opacity={opacity}
      />
      <foreignObject
        x={x_text}
        y={y_text}
        width={Math.max(0, width_text)}
        height={height_text}
        className="breadcrumb-label"
      >
        <div style={{ display: "flex" }}>
          <BreadCrumbText text={displayName} isPlaceholder={false} />
          <>{isActive && <CopyToClipboard stringToCopy={stringToCopy} />}</>
        </div>
      </foreignObject>
    </g>
  );
};
