import { ipcRenderer } from "@common/ipc";
import type { UpdateInfo } from "electron-updater";
import { noop } from "lodash";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { reportError } from "../logging/reporter";

interface AutoUpdateContextProps {
  checkForUpdate: () => void;
  doUpdate: () => boolean;
  error?: string;
  updateInfo: UpdateInfo | false;
}

const AutoUpdateContext = createContext<AutoUpdateContextProps>({
  checkForUpdate: noop,
  doUpdate: () => false,
  updateInfo: false,
});

export const useAutoUpdateContext = (): AutoUpdateContextProps => {
  return useContext(AutoUpdateContext);
};

export const AutoUpdateProvider: React.FC = ({ children }) => {
  const [updateInfo, setUpdateInfo] =
    useState<AutoUpdateContextProps["updateInfo"]>(false);
  const [error, setError] = useState<string>();
  const { t } = useTranslation();
  const checkForUpdate = useCallback(() => {
    ipcRenderer.send("autoUpdate.check");
  }, []);
  const doUpdate = useCallback(
    () => ipcRenderer.sendSync("autoUpdate.doUpdate"),
    []
  );

  useEffect(() => {
    ipcRenderer.on("autoUpdate.onUpdateAvailable", async (_, info) => {
      setUpdateInfo(info);
      if (info) {
        const messageBox = await ipcRenderer.invoke("dialog.showMessageBox", {
          buttons: [t("header.update"), t("header.cancel")],
          message: t("header.aNewVersionIsOut", { version: info.version }),
          title: t("header.newVersion"),
          type: "question",
        });

        if (messageBox.response === 0) {
          const updated = doUpdate();
          if (!updated) {
            await ipcRenderer.invoke("dialog.showMessageBox", {
              message: t("header.noUpdate"),
              type: "warning",
            });
          }
        }
      }
    });
    ipcRenderer.on("autoUpdate.onError", (_, err) => {
      reportError(err);
      setError(err);
    });

    checkForUpdate();
    return () => {
      ipcRenderer.removeAllListeners("autoUpdate.onUpdateAvailable");
      ipcRenderer.removeAllListeners("autoUpdate.onError");
    };
  }, [checkForUpdate, doUpdate, t]);

  return (
    <AutoUpdateContext.Provider
      value={{ checkForUpdate, doUpdate, error, updateInfo }}
    >
      {children}
    </AutoUpdateContext.Provider>
  );
};
