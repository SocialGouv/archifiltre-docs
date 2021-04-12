import { getCurrentWindow } from "@electron/remote";
import React from "react";
import WindowResize from "./window-resize";

type WindowResizeErrorHandlerState = {
  hasError: boolean;
};

export default class WindowResizeErrorHandler extends React.Component<
  {},
  WindowResizeErrorHandlerState
> {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch() {
    this.setState({
      hasError: true,
    });
  }

  render() {
    const { hasError } = this.state;

    if (hasError) {
      getCurrentWindow().show();
      return null;
    } else {
      return <WindowResize />;
    }
  }
}
