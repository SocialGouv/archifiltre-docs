import React from "react";
import WindowResize from "./window-resize";
import { ipcRenderer } from "../../common/ipc";

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
      ipcRenderer.sendSync("window.show");
      return null;
    } else {
      return <WindowResize />;
    }
  }
}
