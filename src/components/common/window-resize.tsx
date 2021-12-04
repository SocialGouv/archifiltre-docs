import React from "react";

import * as UserData from "user-data";
import { ipcRenderer } from "../../common/ipc";

type WindowResizeState = {
  win;
  reader;
  writer;
};

export default class WindowResize extends React.PureComponent<
  {},
  WindowResizeState
> {
  constructor(props) {
    super(props);

    const { reader, writer } = UserData.create({
      width: 620,
      height: 600,
    });

    this.state = {
      win: ipcRenderer.invoke("window.showWindow"), // TODO: async in constructor? Also show window does not return anything. Also², "win" is never used.
      reader,
      writer,
    };

    this.onResize = this.onResize.bind(this);
  }

  onResize() {
    const { writer } = this.state;
    const [width, height] = ipcRenderer.sendSync("window.getSize");

    writer({
      width,
      height,
    });
  }

  componentDidMount() {
    const { reader } = this.state;
    const { width, height } = reader();

    ipcRenderer.sendSync("window.setSize", width, height);

    ipcRenderer.invoke("window.showWindow");

    const onResize = this.onResize;
    window.addEventListener("resize", onResize);
  }

  componentWillUnmount() {
    const onResize = this.onResize;
    window.removeEventListener("resize", onResize);
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    return null;
  }
}
