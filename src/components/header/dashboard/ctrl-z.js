import React from "react";

import { mkRB } from "components/buttons/button";
import { FaUndo, FaRedo } from "react-icons/fa";

class CtrlZ extends React.Component {
  constructor(props) {
    super(props);

    this.onKeyDownHandler = e => {
      if (e.ctrlKey === true) {
        if (e.key === "z") {
          this.props.api.undo.undo();
        } else if (e.key === "Z") {
          this.props.api.undo.redo();
        }
      }
    };

    document.body.addEventListener("keydown", this.onKeyDownHandler, false);

    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.onKeyDownHandler, false);
  }

  render() {
    if (this.props.visible) {
      return (
        <div className="grid-x grid-padding-x">
          <div className="cell small-6">
            {mkRB(
              this.props.api.undo.undo,
              <FaUndo />,
              this.props.api.undo.hasAPast(),
              ""
            )}
          </div>
          <div className="cell small-6">
            {mkRB(
              this.props.api.undo.redo,
              <FaRedo />,
              this.props.api.undo.hasAFuture(),
              ""
            )}
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default CtrlZ;
