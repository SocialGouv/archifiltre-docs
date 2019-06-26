import React, { PureComponent } from "react";
import { animate, clear } from "animation-daemon";
import { generateRandomString } from "util/random-gen-util";
import Icicle from "./icicle";

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

  ani(dom_element, inv, target_x, target_dx, x, dx) {
    return new Promise(resolve => {
      const getTime = () => new Date().getTime();
      const init_time = getTime();
      const target_time = 1000;
      const zeroToOne = () => {
        const current_time = getTime();
        return Math.min(1, (current_time - init_time) / target_time);
      };

      let animation_id;

      // [translateX, scaleX, opacity]
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
      const mutate = () => {
        const zero_to_one = zeroToOne();
        let translate_x = vector[0](zero_to_one);
        let scale_x = vector[1](zero_to_one);
        let opacity = vector[2](zero_to_one);

        dom_element.style.willChange = "transform, opacity";
        dom_element.style.transform = `translateX(${translate_x}px) scaleX(${scale_x})`;
        dom_element.style.opacity = opacity;

        if (zero_to_one >= 1) {
          dom_element.style.willChange = "unset";
          clear(animation_id);
          resolve();
        }
      };

      animation_id = animate(visible, measure, mutate);
    });
  }

  ref(dom_element) {
    this.setState({
      dom_element
    });
  }

  render() {
    const props = this.props;

    const x = props.x;
    const y = props.y;
    const dx = props.dx;
    const dy = props.dy;

    const state = this.state;
    const prevProps = state.prevProps;
    const prevStyle = state.prevStyle;

    const ref = this.ref;

    const svg_id = generateRandomString(40);

    return (
      <g clipPath={"url(#" + svg_id + ")"}>
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
              {...props}
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
