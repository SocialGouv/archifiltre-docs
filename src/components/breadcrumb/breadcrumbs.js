import React from "react";
import BreadCrumbText from "components/breadcrumb/breadcrumb-text";
import BreadCrumbPoly from "components/breadcrumb/breadcrumb-poly";

import * as Color from "util/color-util";

import pick from "languages";

const fileText = pick({
  en: "File",
  fr: "Fichier"
});

const levelText = pick({
  en: "Level",
  fr: "Niveau"
});

const makeBreadKey = id => "breadcrumbc-" + id;
const removeRootId = arr => arr.slice(1);
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

  render() {
    const trueFHeight = this.trueFHeight;
    const { isFocused, isLocked, getFfByFfId, api, root_id } = this.props;

    const displayName = id => {
      const node = getFfByFfId(id);
      return node.alias === "" ? node.name : node.alias;
    };

    let res = [];

    if (isFocused || isLocked) {
      const icicleState = api.icicle_state;
      const locked = icicleState.lock_sequence();
      const hovered = icicleState.hover_sequence();
      const displayedNodes = isFocused ? hovered : locked;
      const paddedDisplayedNodes = removeRootId(displayedNodes);

      const breadcrumbSequenceHeight = paddedDisplayedNodes.map(trueFHeight);
      const cumulatedBreadcrumbSequenceHeight = computeCumulative(
        breadcrumbSequenceHeight
      );

      res = paddedDisplayedNodes.map((node_id, i) => {
        const fillColor = this.props.fillColor(node_id);
        const display_name = displayName(node_id);
        const isLast = i === hovered.length - 1;
        const isFirst = i === 0;

        const dim = this.computeDim(
          cumulatedBreadcrumbSequenceHeight[i],
          breadcrumbSequenceHeight[i]
        );

        const opacity = locked.includes(node_id) ? 1 : isLocked ? 0.4 : 0.7;
        return (
          <g key={makeBreadKey(node_id)}>
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
              text={display_name}
              isPlaceholder={false}
            />
          </g>
        );
      });
    } else {
      const heightChild = trueFHeight(root_id);
      const maxDepth = Math.min(this.props.maxDepth, 5);
      const fillColor = Color.placeholder();

      for (let depth = 0; depth < maxDepth; depth++) {
        const isLast = depth === maxDepth - 1;
        const isFirst = depth === 0;
        const dim = this.computeDim(depth * heightChild, heightChild);

        let displayName;
        if (isLast) {
          displayName = fileText;
        } else if (depth >= 2) {
          displayName = "...";
        } else {
          displayName = `${levelText} ${depth + 1}`;
        }
        res.push(
          <g key={`breadcrumb${depth}`}>
            <BreadCrumbPoly
              isLast={isLast}
              isFirst={isFirst}
              x={dim.x_poly}
              y={dim.y_poly}
              dx={dim.width_poly}
              dy={dim.height_poly}
              fillColor={fillColor}
            />
            <BreadCrumbText
              x={dim.x_text}
              y={dim.y_text}
              dx={dim.width_text}
              dy={dim.height_text}
              text={displayName}
              isPlaceholder={true}
            />
          </g>
        );
      }
    }

    return (
      <g style={{ opacity: isFocused || isLocked ? 1 : 0.3, stroke: "#fff" }}>
        {res}
      </g>
    );
  }
}

export default function BreadcrumbsApiToProps(props) {
  const { icicle_state, database } = props.api;
  const breadcrumb_sequence = icicle_state.sequence();
  const maxDepth = props.maxDepth;

  const componentProps = {
    ...props,
    breadcrumb_sequence,
    isFocused: icicle_state.isFocused(),
    isLocked: icicle_state.isLocked(),
    maxDepth,
    getFfByFfId: props.getFfByFfId,
    root_id: database.rootFfId()
  };

  return <Breadcrumbs {...componentProps} />;
}
