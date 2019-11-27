import React from "react";

export default class Bubble extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.state = {
      mouse_over: false
    };
  }

  onMouseEnter() {
    this.setState({
      mouse_over: true
    });
  }

  onMouseLeave() {
    this.setState({
      mouse_over: false
    });
  }

  render() {
    const state = this.state;
    const mouse_over = state.mouse_over;

    const props = this.props;
    const comp = props.comp;
    const sub_comp = props.sub_comp;

    const style = {
      position: "relative"
    };

    const sub_style = {
      display: "none",
      position: "absolute",
      top: "100%",
      width: "100%",
      zIndex: 3
    };

    if (mouse_over) {
      delete sub_style.display;
    }

    return (
      <div style={style}>
        <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          {comp}
        </div>
        <div
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          style={sub_style}
        >
          <div className="grid-x align-center">
            <div className="cell">{sub_comp}</div>
          </div>
        </div>
      </div>
    );
  }
}
