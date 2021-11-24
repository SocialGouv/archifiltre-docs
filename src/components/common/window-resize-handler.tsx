import React from "react";
import WindowResize from "./window-resize";
import { ipcRenderer } from "electron";

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
      ipcRenderer.invoke("showWindow");
      return null;
    } else {
      return <WindowResize />;
    }
  }
}
