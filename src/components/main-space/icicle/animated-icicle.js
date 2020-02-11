import React, { PureComponent } from "react";
import { animate, clear } from "animation-daemon";
import { generateRandomString } from "util/random-gen-util";
import Icicle from "./icicle";
import { addTracker } from "../../../logging/tracker";
import { ActionTitle, ActionType } from "../../../logging/tracker-types";

export default class AnimatedIcicle extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      prevStyle: {
        display: "none"
      },
      prevProps: props
    };

    this.onIcicleRectDoubleClickHandler = this.onIcicleRectDoubleClickHandler.bind(
      this
    );

    this.ref = this.ref.bind(this);

    this.ani = this.ani.bind(this);
  }

  onIcicleRectDoubleClickHandler(props, event) {
    addTracker({
      title: ActionTitle.ICICLE_ZOOM,
      type: ActionType.TRACK_EVENT
    });
    this.setState(
      {
        prevProps: this.props,
        prevStyle: {
          display: "inherit"
        }
      },
      () => {
        this.props.onIcicleRectDoubleClickHandler(props, event);

        const target_x = this.props.x;
        const target_dx = this.props.dx;

        const dims = props.dims();
        const x = dims.x;
        const dx = dims.dx;

        const children = this.state.dom_element.children;
        const prev_dom_element = children[0];
        const dom_element = children[1];

        Promise.all([
          this.ani(prev_dom_element, false, target_x, target_dx, x, dx),
          this.ani(dom_element, true, x, dx, target_x, target_dx)
        ]).then(() => {
          this.setState({
            prevStyle: {
              display: "none"
            }
          });
        });
      }
    );
  }

  ani(domElement, inv, target_x, target_dx, x, dx) {
    return new Promise(resolve => {
      const getTime = () => new Date().getTime();
      const init_time = getTime();
      const target_time = 1000;
      const zeroToOne = () => {
        const current_time = getTime();
        return Math.min(1, (current_time - init_time) / target_time);
      };

      const init = [0, 1, 1];
      const target = [target_x - x, target_dx / dx, 0];

      if (target_x === 0) {
        target[0] = target[0] * target[1];
      }

      let vector = init.map((val, i) => a => val + (target[i] - val) * a);
      if (inv) {
        vector = target.map((val, i) => a => val + (init[i] - val) * a);
      }

      const visible = () => true;
      const measure = () => {};
      const mutate = animationId => {
        const ratio = zeroToOne();
        const translateX = vector[0](ratio);
        const scaleX = vector[1](ratio);
        const opacity = vector[2](ratio);

        domElement.style.willChange = "transform, opacity";
        domElement.style.transform = `translateX(${translateX}px) scaleX(${scaleX})`;
        domElement.style.opacity = opacity;

        if (ratio >= 1) {
          domElement.style.willChange = "unset";
          clear(animationId);
          resolve();
        }
      };

      animate(visible, measure, mutate);
    });
  }

  ref(dom_element) {
    this.setState({
      dom_element
    });
  }

  render() {
    const { x, y, dx, dy } = this.props;

    const state = this.state;
    const prevProps = state.prevProps;
    const prevStyle = state.prevStyle;

    const ref = this.ref;

    const svg_id = generateRandomString(40);

    return (
      <g
        clipPath={"url(#" + svg_id + ")"}
        onMouseLeave={this.props.onIcicleMouseLeave}
      >
        <defs>
          <clipPath id={svg_id}>
            <rect x={x} y={y} width={dx} height={dy} />
          </clipPath>
        </defs>

        <g ref={ref}>
          <g style={prevStyle}>
            {prevStyle.display !== "none" && <Icicle {...prevProps} />}
          </g>
          <g>
            <Icicle
              {...this.props}
              onIcicleRectDoubleClickHandler={
                this.onIcicleRectDoubleClickHandler
              }
            />
          </g>
        </g>
      </g>
    );
  }
}
