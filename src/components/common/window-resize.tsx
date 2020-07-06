import React from "react";

import * as UserData from "user-data";
import { remote } from "electron";

interface WindowResizeState {
  win;
  reader;
  writer;
}

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
      win: remote.getCurrentWindow(),
      reader,
      writer,
    };

    this.onResize = this.onResize.bind(this);
  }

  onResize() {
    const { win, writer } = this.state;
    const [width, height] = win.getSize();

    writer({
      width,
      height,
    });
  }

  componentDidMount() {
    const { win, reader } = this.state;
    const { width, height } = reader();

    win.setSize(width, height);

    win.show();

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
