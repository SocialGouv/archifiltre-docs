import React from "react";

export default class MultiLinesInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };

    this.onBlur = this.onBlur.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onChange = this.onChange.bind(this);
    this.ref = this.ref.bind(this);
  }

  onBlur() {
    this.props.onFinish(this.state.value);
  }

  onKeyUp(event) {
    const enter_key = "Enter";

    if (event.key === enter_key) {
      this.props.onFinish(this.state.value);
    }
  }

  onChange(event) {
    const value = event.target.value.replace("\n", "");
    this.setState({
      value
    });
  }

  ref(dom_element) {
    if (dom_element) {
      if (this.props.autofocus) {
        dom_element.focus();
        // dom_element.select();
      }
    }
  }

  render() {
    const style = {
      resize: "none",
      padding: 0,
      margin: 0,
      border: 0,
      height: "5em"
    };

    return (
      <textarea
        style={style}
        onBlur={this.onBlur}
        onKeyUp={this.onKeyUp}
        onChange={this.onChange}
        value={this.state.value}
        ref={this.ref}
      />
    );
  }
}
