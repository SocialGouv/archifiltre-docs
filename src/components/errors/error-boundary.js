import React from "react";

import SaveButton from "components/buttons/save-button";
import { reportError } from "../../reporter";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidCatch(error, info) {
    reportError({ error, info });
    this.setState({
      hasError: true
    });
  }

  render() {
    const props = this.props;

    const api = props.api;

    if (this.state.hasError) {
      return (
        <div className="grid-y grid-frame align-center">
          <div
            className="cell small-1"
            style={{
              textAlign: "center"
            }}
          >
            <h1>Something went wrong.</h1>
            <SaveButton api={api} />
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
