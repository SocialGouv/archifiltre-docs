import React from "react";
import * as Color from "util/color-util";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "./breadcrumb";
import { makeEmptyArray } from "../../../util/array-util";
import { ROOT_FF_ID } from "../../../reducers/files-and-folders/files-and-folders-selectors";
import { getDisplayName } from "../../../util/file-and-folders-utils";

const computeCumulative = array => {
  const ans = [0];
  for (let i = 0; i < array.length - 1; i++) {
    ans.push(array[i] + ans[i]);
  }
  return ans;
};

class Breadcrumbs extends React.PureComponent {
  constructor(props) {
    super(props);

    this.trueFHeight = this.trueFHeight.bind(this);
    this.computeDim = this.computeDim.bind(this);
    this.getNodeDisplayName = this.getNodeDisplayName.bind(this);
    this.getInactiveBreadcrumbs = this.getInactiveBreadcrumbs.bind(this);
    this.getFillColor = this.getFillColor.bind(this);
    this.getOpacity = this.getOpacity.bind(this);
  }

  trueFHeight(id) {
    const height = this.props.dy;
    return this.props.trueFHeight(height, id);
  }

  computeDim(y, height) {
    const props = this.props;
    const offset = 30;
    const x = props.x + offset;
    const dx = props.dx - offset;

    const x_poly = x;
    const y_poly = y;
    const width_poly = dx / 20;
    const height_poly = height;

    const remaining_space_dx = dx - width_poly;

    const x_text = x_poly + width_poly + remaining_space_dx / 20;
    const y_text = y_poly;
    const width_text = (remaining_space_dx * 19) / 20;

    return {
      x_poly,
      y_poly,
      width_poly,
      height_poly,
      x_text,
      y_text,
      width_text,
      height_text: height
    };
  }

  getNodeDisplayName(nodeId) {
    const { aliases, getFfByFfId } = this.props;
    const node = getFfByFfId(nodeId);
    return getDisplayName(node.name, aliases[nodeId]);
  }

  getInactiveBreadcrumbs(maxHeight) {
    const maxDepth = Math.min(this.props.maxDepth, 5);
    const topLevel = `${this.props.t("workspace.level")} 1`;
    const secondLevel =
      maxHeight > 2 ? [`${this.props.t("workspace.level")} 2`] : [];
    const intermediateLevels = makeEmptyArray(Math.max(maxDepth - 3, 0), "...");
    const lastLevel = this.props.t("workspace.file");
    return [topLevel, ...secondLevel, ...intermediateLevels, lastLevel];
  }

  getFillColor(isActive, nodeId) {
    return isActive ? this.props.fillColor(nodeId) : Color.placeholder();
  }

  getOpacity(isLocked, nodeId) {
    return this.props.lockedSequence.includes(nodeId)
      ? 1
      : isLocked
      ? 0.4
      : 0.7;
  }

  render() {
    const {
      isFocused,
      isLocked,
      onBreadcrumbClick,
      hoverSequence,
      lockedSequence,
      originalPath,
      root_id,
      maxDepth
    } = this.props;
    const trueFHeight = this.trueFHeight;
    const activeBreadcrumbs = isFocused ? hoverSequence : lockedSequence;
    const inactiveBreadcrumbs = this.getInactiveBreadcrumbs(maxDepth);
    const breadcrumbSequenceHeight = activeBreadcrumbs.map(trueFHeight);
    const cumulatedBreadcrumbSequenceHeight = computeCumulative(
      breadcrumbSequenceHeight
    );
    const childHeight = trueFHeight(root_id);
    const isActive = isFocused || isLocked;
    const breadcrumbs = isActive ? activeBreadcrumbs : inactiveBreadcrumbs;

    return (
      <g style={{ opacity: isFocused || isLocked ? 1 : 0.3, stroke: "#fff" }}>
        {breadcrumbs.map((nodeId, depth) => {
          const fillColor = this.getFillColor(isActive, nodeId);
          const displayName = isActive
            ? this.getNodeDisplayName(nodeId)
            : nodeId;
          const opacity = this.getOpacity(isLocked, nodeId);
          const isFirst = depth === 0;
          const isLast = isActive
            ? depth === maxDepth - 1
            : depth === inactiveBreadcrumbs.length - 1;
          const dim = isActive
            ? this.computeDim(
                cumulatedBreadcrumbSequenceHeight[depth],
                breadcrumbSequenceHeight[depth]
              )
            : this.computeDim(depth * childHeight, childHeight);

          return (
            <Breadcrumb
              key={`breadcrumb-${depth}`}
              fillColor={fillColor}
              nodeId={nodeId}
              displayName={displayName}
              dim={dim}
              isLast={isLast}
              isFirst={isFirst}
              opacity={opacity}
              onBreadcrumbClick={onBreadcrumbClick}
              originalPath={originalPath}
              isActive={isActive}
            />
          );
        })}
      </g>
    );
  }
}

export default function BreadcrumbsApiToProps(props) {
  const {
    aliases,
    maxDepth,
    getFfByFfId,
    originalPath,
    hoverSequence,
    lockedSequence
  } = props;
  const { t } = useTranslation();

  return (
    <Breadcrumbs
      {...props}
      aliases={aliases}
      originalPath={originalPath}
      isFocused={hoverSequence.length > 0}
      isLocked={lockedSequence.length > 0}
      maxDepth={maxDepth}
      getFfByFfId={getFfByFfId}
      root_id={ROOT_FF_ID}
      t={t}
    />
  );
}
