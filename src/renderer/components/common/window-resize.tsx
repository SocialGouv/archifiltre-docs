import { ipcRenderer } from "@common/ipc";
import type React from "react";
import { useEffect } from "react";

// this is only a replace
// TODO: move to main, and save fullscreen state in user param
export const WindowResize: React.FC = () => {
  useEffect(() => {
    ipcRenderer.sendSync("window.maximize");
  });
  return null;
};
