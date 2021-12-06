import React from "react";

import * as UserData from "user-data";
import { ipcRenderer } from "../../common/ipc";

type WindowResizeState = {
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

    ipcRenderer.sendSync("window.show");

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
