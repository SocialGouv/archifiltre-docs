import React from "react";

export default class Bubble extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.state = {
      mouseOver: false,
    };
  }

  onMouseEnter() {
    this.setState({
      mouseOver: true,
    });
  }

  onMouseLeave() {
    this.setState({
      mouseOver: false,
    });
  }

  render() {
    const { mouseOver } = this.state;
    const {
      comp,
      sub_comp,
      backgroundColor = "",
      borderRadius = 0,
      width = "100%",
    } = this.props;

    const style = {
      position: "relative",
      width,
    };

    const subStyle = {
      display: "none",
      position: "absolute",
      top: "100%",
      width: "100%",
      zIndex: 3,
      backgroundColor,
      borderRadius,
    };

    if (mouseOver) {
      delete subStyle.display;
    }

    return (
      <div style={style}>
        <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          {comp}
        </div>
        <div
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          style={subStyle}
        >
          <div className="grid-x align-center">
            <div className="cell">{sub_comp}</div>
          </div>
        </div>
      </div>
    );
  }
}
