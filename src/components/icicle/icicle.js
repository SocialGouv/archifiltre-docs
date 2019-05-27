import React, { PureComponent } from "react";
import { updateIn } from "immutable";
import IcicleRect from "./icicle-rect";
import * as FunctionUtil from "../../util/function-util";
import IcicleRecursive from "./icicle-recursive";
import IcicleTags from "./icicle-tags";

export default class Icicle extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dims: {}
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
    this.setState(state =>
      updateIn(state, ["dims", id], () => {
        return { x, dx, y, dy };
      })
    );
  }

  makeKey(id) {
    return "icicle-display-root-" + id;
  }

  removeRootId(arr) {
    return arr.slice(1);
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

      const array_of_id_without_root_id = array_of_id.slice(1);
      return array_of_id_without_root_id.map(id => {
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

    const props = this.props;

    const root_id = props.root_id;
    const x = props.x;
    const y = props.y;
    const dx = props.dx;
    const dy = props.dy;

    const display_root = props.display_root;
    const computeWidthRec = props.computeWidthRec;

    const fWidth = props.fWidth;
    const normalizeWidth = props.normalizeWidth;
    const getChildrenIdFromId = props.getChildrenIdFromId;

    const shouldRenderChild = props.shouldRenderChild;

    const onClickHandler = props.onIcicleRectClickHandler;
    const onDoubleClickHandler = props.onIcicleRectDoubleClickHandler;
    const onMouseOverHandler = props.onIcicleRectMouseOverHandler;

    const fillColor = props.fillColor;

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

    const api = this.props.api;
    const icicle_state = api.icicle_state;

    let style = {};
    if (icicle_state.isFocused() || icicle_state.isLocked()) {
      style.opacity = 0.3;
    }

    const sequence = icicle_state.sequence();
    const sequence_components = arrayOfIdToComponents("sequence", 1, sequence);

    const hover = icicle_state.hover_sequence();
    const hover_components = arrayOfIdToComponents("hover", 0.3, hover);

    const database = api.database;
    const tag_ids = database.getAllTagIds();
    const getTagByTagId = database.getTagByTagId;
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
        {hover_components}
        {sequence_components}
        <IcicleTags
          tag_ids={tag_ids}
          getTagByTagId={getTagByTagId}
          dims={dims}
          tag_id_to_highlight={tag_id_to_highlight}
          onClick={onClickHandler}
          onDoubleClick={onDoubleClickHandler}
          onMouseOver={onMouseOverHandler}
        />
      </g>
    );
  }
}
