import React, { PureComponent } from "react";
import MinimapBracket from "../minimap-bracket";
import { animate, clear } from "../../animation-daemon";
import * as ArrayUtil from "util/array-util.ts";
import Ruler from "components/ruler";
import BreadCrumbs from "components/breadcrumbs";
import * as FunctionUtil from "util/function-util";
import Icicle from "./icicle";
import AnimatedIcicle from "./animated-icicle";

export default class IcicleMain extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      view_box_width: 1000,
      view_box_height: 300
    };

    this.responsiveAnimation = this.responsiveAnimation.bind(this);

    this.ref = this.ref.bind(this);

    this.getComputeWidthFunc = this.getComputeWidthFunc.bind(this);
    this.computeWidthByNbFiles = this.computeWidthByNbFiles.bind(this);
    this.computeWidthBySize = this.computeWidthBySize.bind(this);
    this.normalizeWidth = this.normalizeWidth.bind(this);
    this.trueFHeight = this.trueFHeight.bind(this);

    this.icicleWidth = this.icicleWidth.bind(this);
    this.icicleHeight = this.icicleHeight.bind(this);
    this.breadcrumbsWidth = this.breadcrumbsWidth.bind(this);
    this.rulerHeight = this.rulerHeight.bind(this);

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);

    this.shouldRenderChildIcicle = this.shouldRenderChildIcicle.bind(this);
    this.shouldRenderChildMinimap = this.shouldRenderChildMinimap.bind(this);

    this.nodeSequence = this.nodeSequence.bind(this);

    this.onIcicleRectClickHandler = this.onIcicleRectClickHandler.bind(this);
    this.onIcicleRectDoubleClickHandler = this.onIcicleRectDoubleClickHandler.bind(
      this
    );
    this.onIcicleRectMouseOverHandler = this.onIcicleRectMouseOverHandler.bind(
      this
    );
    this.onIcicleMouseLeave = this.onIcicleMouseLeave.bind(this);
    this.computeWidthRec = this.computeWidthRec.bind(this);
  }

  icicleWidth() {
    return (this.state.view_box_width * 8) / 12;
  }

  icicleHeight() {
    return (this.state.view_box_height * 8) / 12;
  }

  breadcrumbsWidth() {
    return this.state.view_box_width - this.icicleWidth();
  }

  rulerHeight() {
    return this.state.view_box_height - this.icicleHeight();
  }

  responsiveAnimation(dom_element) {
    if (dom_element) {
      const visible = () => true;
      const measure = () => {
        try {
          const width = dom_element.width.baseVal.value;
          const height = dom_element.height.baseVal.value;
          this.setState({
            view_box_width: width,
            view_box_height: height
          });
        } catch (e) {
          // Empty block
        }
      };
      const mutate = () => {};

      this.animation_id = animate(visible, measure, mutate);
    } else {
      clear(this.animation_id);
    }
  }

  ref(dom_element) {
    this.responsiveAnimation(dom_element);
  }

  computeWidthRec(ids, x, dx) {
    const ans = [[x, dx]];

    if (ids.length < 2) {
      return ans;
    } else {
      const fWidth = this.getComputeWidthFunc();
      const normalizeWidth = this.normalizeWidth;
      const getChildrenIdFromId = this.props.getChildrenIdFromId;

      const parent_id = ids[0];
      const child_id = ids[1];
      ids = ids.slice(1);

      const children_ids = getChildrenIdFromId(parent_id);
      const width_array = normalizeWidth(children_ids.map(fWidth)).map(
        a => a * dx
      );
      const cumulated_width_array = ArrayUtil.computeCumulative(width_array);
      const index_of = children_ids.indexOf(child_id);
      x = cumulated_width_array[index_of] + x;
      dx = width_array[index_of];

      return ans.concat(this.computeWidthRec(ids, x, dx));
    }
  }

  getComputeWidthFunc() {
    return this.props.width_by_size
      ? this.computeWidthBySize
      : this.computeWidthByNbFiles;
  }

  computeWidthBySize(id) {
    return this.props.getFfByFfId(id).childrenTotalSize;
  }

  computeWidthByNbFiles(id) {
    return this.props.getFfByFfId(id).nbChildrenFiles;
  }

  normalizeWidth(arr) {
    const sum = arr.reduce((a, b) => a + b, 0);
    return arr.map(a => a / sum);
  }

  trueFHeight(height) {
    return height / this.props.maxDepth;
  }

  shouldRenderChildIcicle(x, dx) {
    const dx_threshold = 1;
    const x_window = 0;
    const dx_window = this.icicleWidth() - 1;

    if (x + dx < x_window || x_window + dx_window < x) {
      return false;
    } else {
      return dx >= dx_threshold;
    }
  }

  shouldRenderChildMinimap(x, dx) {
    const dx_threshold = 2.5;

    return dx >= dx_threshold;
  }

  onClickHandler() {
    this.props.unlock();
    this.props.setNoFocus();
  }
  onMouseLeaveHandler() {
    if (!this.props.isLocked) {
      this.props.setNoFocus();
    }
  }

  nodeSequence(id) {
    return this.props.getFfIdPath(id).toJS();
  }

  onIcicleRectClickHandler(props, event) {
    event.stopPropagation();
    const node_id = props.id;
    const dims = props.dims();

    const node_sequence = this.nodeSequence(node_id);
    this.props.lock(node_sequence, dims);
  }
  onIcicleRectDoubleClickHandler(props) {
    const node_id = props.id;

    const node_sequence = this.nodeSequence(node_id);
    this.props.setDisplayRoot(node_sequence);
  }
  onIcicleRectMouseOverHandler(props) {
    const node_id = props.id;
    const dims = props.dims();

    const node_sequence = this.nodeSequence(node_id);
    this.props.setFocus(node_sequence, dims);
  }

  onIcicleMouseLeave() {
    this.props.setNoHover();
  }

  render() {
    const { api, tags } = this.props;
    const view_box_width = this.state.view_box_width;
    const view_box_height = this.state.view_box_height;

    const icicle_width = this.icicleWidth();
    const icicle_height = this.icicleHeight();

    const breadcrumbs_width = this.breadcrumbsWidth();
    const ruler_height = this.rulerHeight();

    const minimap_x = icicle_width + 30;
    const minimap_y = icicle_height + 10;
    const minimap_width = breadcrumbs_width - 30;
    const minimap_height = ruler_height - 20;
    const fWidth = this.getComputeWidthFunc();

    const icicle = (
      <g>
        <AnimatedIcicle
          api={api}
          x={0}
          y={0}
          dx={icicle_width}
          dy={icicle_height}
          tags={tags}
          root_id={this.props.root_id}
          display_root={this.props.display_root}
          fWidth={fWidth}
          normalizeWidth={this.normalizeWidth}
          trueFHeight={this.trueFHeight}
          getChildrenIdFromId={this.props.getChildrenIdFromId}
          fillColor={this.props.fillColor}
          sequence={this.props.sequence}
          hover_sequence={this.props.hover_sequence}
          shouldRenderChild={this.shouldRenderChildIcicle}
          onIcicleRectClickHandler={this.onIcicleRectClickHandler}
          onIcicleRectDoubleClickHandler={this.onIcicleRectDoubleClickHandler}
          onIcicleRectMouseOverHandler={this.onIcicleRectMouseOverHandler}
          onIcicleMouseLeave={this.onIcicleMouseLeave}
          computeWidthRec={this.computeWidthRec}
        />

        <Ruler
          api={api}
          getFfByFfId={this.props.getFfByFfId}
          x={0}
          y={icicle_height}
          dx={icicle_width}
          dy={ruler_height}
          fillColor={this.props.fillColor}
        />

        <BreadCrumbs
          api={api}
          getFfByFfId={this.props.getFfByFfId}
          maxDepth={this.props.maxDepth}
          x={icicle_width}
          dx={breadcrumbs_width}
          dy={icicle_height}
          trueFHeight={this.trueFHeight}
          fillColor={this.props.fillColor}
        />

        <g>
          <rect
            x={minimap_x}
            y={minimap_y}
            width={minimap_width}
            height={minimap_height}
            style={{ fill: "white", opacity: "0.4" }}
          />
          <Icicle
            api={api}
            x={minimap_x + 5}
            y={minimap_y + 5}
            dx={minimap_width - 10}
            dy={minimap_height - 10}
            root_id={this.props.root_id}
            display_root={ArrayUtil.empty}
            fWidth={fWidth}
            normalizeWidth={this.normalizeWidth}
            trueFHeight={this.trueFHeight}
            getChildrenIdFromId={this.props.getChildrenIdFromId}
            fillColor={this.props.fillColor}
            sequence={this.props.sequence}
            hover_sequence={this.props.hover_sequence}
            shouldRenderChild={this.shouldRenderChildMinimap}
            onIcicleRectClickHandler={FunctionUtil.empty}
            onIcicleRectDoubleClickHandler={FunctionUtil.empty}
            onIcicleRectMouseOverHandler={FunctionUtil.empty}
            computeWidthRec={this.computeWidthRec}
            tags={tags}
          />
          <MinimapBracket
            x={minimap_x + 5}
            y={minimap_y + 5}
            dx={minimap_width - 10}
            dy={minimap_height - 10}
            display_root={this.props.display_root}
            computeWidthRec={this.computeWidthRec}
            fillColor={this.props.fillColor}
          />
        </g>
      </g>
    );

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={"0 0 " + view_box_width + " " + view_box_height}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        ref={this.ref}
        onClick={this.onClickHandler}
        onMouseLeave={this.onMouseLeaveHandler}
      >
        {icicle}
      </svg>
    );
  }
}
