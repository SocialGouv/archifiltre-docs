import React from "react";
import * as ArrayUtil from "util/array/array-util";

import IcicleRect from "./icicle-rect";

export default class IcicleRecursive extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  makeKey(id) {
    return "icicle-recursive-" + id;
  }

  render() {
    const props = this.props;

    const id = props.id;
    const x = props.x;
    const width = props.width;
    const y = props.y;
    const height = props.height;

    const getChildrenIdFromId = props.getChildrenIdFromId;
    const fWidth = props.fWidth;
    const normalizeWidth = props.normalizeWidth;
    const trueFHeight = props.trueFHeight;

    const shouldRenderChild = props.shouldRenderChild;

    const fillColor = props.fillColor;
    const onClickHandler = props.onClickHandler;
    const onDoubleClickHandler = props.onDoubleClickHandler;
    const onMouseOverHandler = props.onMouseOverHandler;

    const registerDims = props.registerDims;

    const children = getChildrenIdFromId(id);
    const children_width = normalizeWidth(children.map(fWidth)).map(
      (a) => a * width
    );
    const cumulated_children_width = ArrayUtil.computeCumulative(
      children_width
    );

    const children_height = children.map(trueFHeight);

    const children_component = children.map((child_id, i) => {
      const x_child = x + cumulated_children_width[i];
      const width_child = children_width[i];

      const should_render_child = shouldRenderChild(x_child, width_child);

      if (should_render_child === false) {
        return <g key={this.makeKey(child_id)} />;
      }

      const y_child = y;
      const height_child = children_height[i];

      const x_prime = x_child;
      const width_prime = width_child;
      const y_prime = y_child + height_child;
      const height_prime = height - height_child;

      return (
        <g key={this.makeKey(child_id)}>
          <IcicleRect
            id={child_id}
            x={x_child}
            y={y_child}
            dx={width_child}
            dy={height_child}
            opacity={1}
            fillColor={fillColor}
            onClickHandler={onClickHandler}
            onDoubleClickHandler={onDoubleClickHandler}
            onMouseOverHandler={onMouseOverHandler}
            registerDims={registerDims}
          />
          <IcicleRecursive
            x={x_prime}
            y={y_prime}
            width={width_prime}
            height={height_prime}
            id={child_id}
            fWidth={fWidth}
            normalizeWidth={normalizeWidth}
            trueFHeight={trueFHeight}
            getChildrenIdFromId={getChildrenIdFromId}
            shouldRenderChild={shouldRenderChild}
            fillColor={fillColor}
            onClickHandler={onClickHandler}
            onDoubleClickHandler={onDoubleClickHandler}
            onMouseOverHandler={onMouseOverHandler}
            registerDims={registerDims}
          />
        </g>
      );
    });

    return <g>{children_component}</g>;
  }
}
