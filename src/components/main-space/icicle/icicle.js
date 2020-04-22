import React, { PureComponent } from "react";
import { updateIn } from "immutable";
import IcicleRect from "./icicle-rect";
import * as FunctionUtil from "util/function/function-util";
import IcicleRecursive from "./icicle-recursive";
import IcicleEnrichments from "./icicle-enrichments";

export default class Icicle extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dims: {},
    };

    this.registerDims = this.registerDims.bind(this);
    this.shouldResetDims = false;

    this.trueFHeight = this.trueFHeight.bind(this);

    this.arrayOfIdToComponents = this.arrayOfIdToComponents.bind(this);
  }

  registerDims(x, dx, y, dy, id) {
    if (this.shouldResetDims) {
      this.setState({ dims: {} });
      this.shouldResetDims = false;
    }
    this.setState((state) =>
      updateIn(state, ["dims", id], () => {
        return { x, dx, y, dy };
      })
    );
  }

  trueFHeight(id) {
    const height = this.props.dy;
    return this.props.trueFHeight(height, id);
  }

  arrayOfIdToComponents(key_prefix, opacity, array_of_id) {
    if (array_of_id.length) {
      const props = this.props;

      const onClickHandler = props.onIcicleRectClickHandler;
      const onDoubleClickHandler = props.onIcicleRectDoubleClickHandler;
      const onMouseOverHandler = props.onIcicleRectMouseOverHandler;

      const fillColor = props.fillColor;

      const state = this.state;

      const array_of_id_without_root_id = array_of_id.filter((id) => id !== "");
      return array_of_id_without_root_id.map((id) => {
        const dims = state.dims[id];
        if (dims === undefined) {
          return <g key={key_prefix + id} />;
        }
        const x = dims.x;
        const dx = dims.dx;
        const y = dims.y;
        const dy = dims.dy;

        return (
          <IcicleRect
            key={key_prefix + id}
            id={id}
            x={x}
            y={y}
            dx={dx}
            dy={dy}
            opacity={opacity}
            fillColor={fillColor}
            onClickHandler={onClickHandler}
            onDoubleClickHandler={onDoubleClickHandler}
            onMouseOverHandler={onMouseOverHandler}
            registerDims={FunctionUtil.empty}
          />
        );
      });
    } else {
      return [];
    }
  }

  render() {
    this.shouldResetDims = true;

    const {
      api,
      aliases,
      comments,
      computeWidthRec,
      display_root,
      dx,
      dy,
      fillColor,
      fWidth,
      getChildrenIdFromId,
      normalizeWidth,
      elementsToDelete,
      hoverSequence,
      lockedSequence,
      onIcicleRectClickHandler: onClickHandler,
      onIcicleRectDoubleClickHandler: onDoubleClickHandler,
      onIcicleRectMouseOverHandler: onMouseOverHandler,
      root_id,
      shouldRenderChild,
      tags,
      x,
      y,
    } = this.props;

    const trueFHeight = this.trueFHeight;
    const registerDims = this.registerDims;
    const arrayOfIdToComponents = this.arrayOfIdToComponents;

    const [xc, dxc] = computeWidthRec(display_root, x, dx).slice(-1)[0];

    let x_prime = (x + (x - xc)) * (dx / dxc);
    let dx_prime = dx * (dx / dxc);

    if (Number.isNaN(x_prime)) {
      x_prime = 0;
    }

    if (Number.isNaN(dx_prime)) {
      dx_prime = 0;
    }

    const icicle_state = api.icicle_state;

    const style = {};
    if (hoverSequence.length > 0 || lockedSequence.length > 0) {
      style.opacity = 0.3;
    }

    // Locked + hovered => 1
    // Locked + not hovered => 0.6
    // NotLocked + hovered => 0.3
    let lockedHovered;
    if (hoverSequence.length > 0) {
      lockedHovered = lockedSequence.filter((id) => hoverSequence.includes(id));
    } else {
      lockedHovered = lockedSequence;
    }

    const lockedNotHovered = lockedSequence.filter(
      (id) => !hoverSequence.includes(id)
    );

    const unlockedHovered = hoverSequence.filter(
      (id) => !lockedSequence.includes(id)
    );

    const lockedHoveredComponents = arrayOfIdToComponents(
      "lockedDisplay",
      1,
      lockedHovered
    );
    const lockedNotHoveredComponents = arrayOfIdToComponents(
      "lockedNotHovered",
      0.6,
      lockedNotHovered
    );
    const unlockedHoveredComponents = arrayOfIdToComponents(
      "unlockedHovered",
      lockedSequence.length === 0 ? 0.6 : 0.3,
      unlockedHovered
    );

    const dims = this.state.dims;
    const tag_id_to_highlight = icicle_state.tagIdToHighlight();
    return (
      <g>
        <g style={style}>
          <IcicleRecursive
            x={x_prime}
            y={y}
            width={dx_prime}
            height={dy}
            id={root_id}
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
        {lockedHoveredComponents}
        {lockedNotHoveredComponents}
        {unlockedHoveredComponents}
        <IcicleEnrichments
          tags={tags}
          aliases={aliases}
          comments={comments}
          dims={dims}
          highlightedTagId={tag_id_to_highlight}
          elementsToDelete={elementsToDelete}
          onClick={onClickHandler}
          onDoubleClick={onDoubleClickHandler}
          onMouseOver={onMouseOverHandler}
          onFocus={onMouseOverHandler}
        />
      </g>
    );
  }
}
