import React from "react";

import * as FunctionUtil from "util/function-util";
import SvgRectangle from './svg-rectangle';

export default class IcicleRect extends React.PureComponent {
  constructor(props) {
    super(props);

    this.register = this.register.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);

    this.dims = this.dims.bind(this);

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onDoubleClickHandler = this.onDoubleClickHandler.bind(this);
    this.onMouseOverHandler = this.onMouseOverHandler.bind(this);
  }

  register() {
    const props = this.props;

    const x = props.x;
    const dx = props.dx;
    const y = props.y;
    const dy = props.dy;

    const id = props.id;

    props.registerDims(x, dx, y, dy, id);
  }

  componentDidMount() {
    this.register();
  }

  componentDidUpdate() {
    this.register();
  }

  dims() {
    return {
      x: this.props.x,
      y: this.props.y,
      dx: this.props.dx,
      dy: this.props.dy
    };
  }

  onClickHandler(e) {
    this.props.onClickHandler(
      {
        id: this.props.id,
        dims: this.dims
      },
      e
    );
  }
  onDoubleClickHandler(e) {
    this.props.onDoubleClickHandler(
      {
        id: this.props.id,
        dims: this.dims
      },
      e
    );
  }
  onMouseOverHandler(e) {
    this.props.onMouseOverHandler(
      {
        id: this.props.id,
        dims: this.dims
      },
      e
    );
  }

  render() {
    const props = this.props;

    const id = props.id;
    const opacity = props.opacity;

    const fill = this.props.fillColor(id);

    const x = props.x;
    const dx = props.dx;
    const y = props.y;
    const dy = props.dy;

    let cursor = "pointer";
    if (props.onClickHandler === FunctionUtil.empty) {
      cursor = "initial";
    }

    return (
      <g>
        <SvgRectangle
          key="rect"
          x={x}
          y={y}
          dx={dx}
          dy={dy}
          onClickHandler={this.onClickHandler}
          onDoubleClickHandler={this.onDoubleClickHandler}
          onMouseOverHandler={this.onMouseOverHandler}
          fill={fill}
          opacity={opacity}
          stroke={"#fff"}
          cursor={cursor}
        />
      </g>
    );
  }
}
