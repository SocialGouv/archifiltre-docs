import { ipcRenderer } from "electron";
import { PureComponent } from "react";

import { ipcRenderer } from "../../common/ipc";
import * as UserData from "../../user-data";

type WindowResizeState = UserData.UserData;

export class WindowResize extends PureComponent<unknown, WindowResizeState> {
    constructor(props: unknown) {
        super(props);

        const { reader, writer } = UserData.create({
            height: 600,
            width: 620,
        });

        this.state = {
            reader,
            writer,
        };

        this.onResize = this.onResize.bind(this);
    }

    onResize() {
        const { writer } = this.state;
        const [width, height] = ipcRenderer.sendSync("window.getSize");

        writer({
            height,
            width,
        });
    }

    componentDidMount() {
        const { reader } = this.state;
        const { width, height } = reader();

        ipcRenderer.sendSync("window.setSize", width, height);

        ipcRenderer.sendSync("window.show");

        const onResize = this.onResize.bind(this);
        window.addEventListener("resize", onResize);
    }

    componentWillUnmount(): void {
        const onResize = this.onResize.bind(this);
        window.removeEventListener("resize", onResize);
    }

    componentDidCatch(error: unknown, info: unknown): void {
        console.log(error, info);
    }

    render(): null {
        return null;
    }
}
