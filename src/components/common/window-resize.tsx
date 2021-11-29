import { ipcRenderer } from "electron";
import { PureComponent } from "react";

import * as UserData from "../../user-data";

type WindowResizeState = UserData.UserData;

export default class WindowResize extends PureComponent<
    unknown,
    WindowResizeState
> {
    constructor(props: unknown) {
        super(props);

        const { reader, writer } = UserData.create({
            height: 600,
            width: 620,
        });

        void ipcRenderer.invoke("showWindow");
        this.state = {
            reader,
            writer,
        };

        this.onResize = this.onResize.bind(this);
    }

    onResize(): void {
        const { writer } = this.state;
        const [width, height] = ipcRenderer.sendSync("getSize");

        writer({
            height,
            width,
        });
    }

    componentDidMount(): void {
        const { reader } = this.state;
        const { width, height } = reader();

        ipcRenderer.sendSync("setSize", width, height);

        void ipcRenderer.invoke("showWindow");

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
