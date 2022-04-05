import { ipcRenderer } from "@common/ipc";
import React, { Component } from "react";

import { WindowResize } from "./window-resize";

export interface WindowResizeErrorHandlerState {
  hasError: boolean;
}

export class WindowResizeErrorHandler extends Component<
  unknown,
  WindowResizeErrorHandlerState
> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(): void {
    this.setState({
      hasError: true,
    });
  }

  render(): React.ReactNode {
    const { hasError } = this.state;

    if (hasError) {
      ipcRenderer.sendSync("window.show");
      return null;
    } else {
      return <WindowResize />;
    }
  }
}
