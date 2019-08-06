import React from "react";

import { mkRB } from "components/button";
import pick from "languages";

export default class Hint extends React.Component {
  constructor(props) {
    super(props);

    const len = props.hints.length;

    this.state = {
      index: Math.floor(Math.random() * len)
    };

    this.hintsLength = this.hintsLength.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
  }

  hintsLength() {
    return this.props.hints.length;
  }

  updateIndex(should_increment) {
    const index = this.state.index;
    const hints_length = this.hintsLength();

    let next_index;
    if (should_increment) {
      next_index = index + 1;
    } else {
      next_index = index - 1;
    }

    if (next_index === hints_length) {
      next_index = 0;
    }

    if (next_index === -1) {
      next_index = hints_length - 1;
    }

    this.setState({
      index: next_index
    });
  }

  render() {
    const enable = true;
    const hex_str_color = "";
    const label = class_name => (
      <i className={class_name} style={{ fontSize: "1.6em" }} />
    );
    const leftCallback = () => {
      const should_increment = false;
      this.updateIndex(should_increment);
    };
    const left_label = label("fi-arrow-left");
    const rightCallback = () => {
      const should_increment = true;
      this.updateIndex(should_increment);
    };
    const right_label = label("fi-arrow-right");

    return (
      <div
        className="grid-x align-center align-middle"
        style={{ padding: "0em 3em" }}
      >
        <div className="cell shrink">
          {mkRB(leftCallback, left_label, enable, hex_str_color, {
            marginBottom: "0"
          })}
        </div>

        <div className="cell small-10">
          <div
            style={{
              wordBreak: "break-word",
              padding: "0em 3em"
            }}
          >
            <div className="grid-x">
              <div className="cell small-12">
                {pick({
                  en: `Hint ${this.state.index + 1}/${this.hintsLength()} :`,
                  fr: `Astuce ${this.state.index + 1}/${this.hintsLength()} :`
                })}
              </div>
              <div className="cell small-12">
                {this.props.hints[this.state.index]}
              </div>
            </div>
          </div>
        </div>

        <div className="cell shrink">
          {mkRB(rightCallback, right_label, enable, hex_str_color, {
            marginBottom: "0"
          })}
        </div>
      </div>
    );
  }
}
