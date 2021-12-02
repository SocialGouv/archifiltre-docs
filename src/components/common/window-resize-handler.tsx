import { ipcRenderer } from "electron";
import React, { Component } from "react";

import { WindowResize } from "./window-resize";

interface WindowResizeErrorHandlerState {
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
            void ipcRenderer.invoke("showWindow");
            return null;
        } else {
            return <WindowResize />;
        }
    }
}
