import { ipcRenderer } from "@common/ipc";
import type { ReplyDualAsyncIpcMapping } from "@common/ipc/event";
import { useCallback, useEffect, useState } from "react";

export interface UseAutoUpdateParam {
  onUpdateAvailable: (
    ...args: ReplyDualAsyncIpcMapping["autoUpdate.onUpdateAvailable"]["args"]
  ) => void;
  onUpdateError: (
    ...args: ReplyDualAsyncIpcMapping["autoUpdate.onError"]["args"]
  ) => void;
}
export type UseAutoUpdate = (param?: Partial<UseAutoUpdateParam>) => {
  checkForUpdate: () => void;
  doUpdate: () => boolean;
  updateAvailable: boolean;
};

export const useAutoUpdate: UseAutoUpdate = ({
  onUpdateAvailable,
  onUpdateError,
} = {}) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const checkForUpdate = useCallback(() => {
    ipcRenderer.send("autoUpdate.check");
  }, []);
  const doUpdate = useCallback(
    () => ipcRenderer.sendSync("autoUpdate.doUpdate"),
    []
  );

  useEffect(() => {
    ipcRenderer.on("autoUpdate.onUpdateAvailable", (_, info) => {
      setUpdateAvailable(true);
      onUpdateAvailable?.(info);
    });
    if (onUpdateError)
      ipcRenderer.on("autoUpdate.onError", (_, error) => {
        onUpdateError(error);
      });

    checkForUpdate();
    return () => {
      if (onUpdateAvailable)
        ipcRenderer.off("autoUpdate.onUpdateAvailable", (_, info) => {
          onUpdateAvailable(info);
        });
      if (onUpdateError)
        ipcRenderer.off("autoUpdate.onError", (_, error) => {
          onUpdateError(error);
        });
    };
  }, []);

  return {
    checkForUpdate,
    doUpdate,
    updateAvailable,
  };
};
