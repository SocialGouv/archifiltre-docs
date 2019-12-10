import React from "react";

import AsyncHandleDrop from "async-handle-drop";

import TextAlignCenter from "components/common/text-align-center";

import path from "path";

import {
  filesAndFoldersMapToArray,
  getFiles
} from "../../util/file-and-folders-utils";
import { isJsonFile, countZipFiles } from "../../util/file-sys-util";
import { expectToBeDefined } from "../../util/expect-behaviour";
import { notifyError, notifyInfo } from "../../util/notifications-util";
import { withTranslation } from "react-i18next";
import { addTracker } from "../../logging/tracker";
import { ActionType, ActionTitle } from "../../logging/tracker-types";
import { wait } from "../../util/promise-util";

const displayZipNotification = (zipCount, t) => {
  notifyInfo(
    t("folderDropzone.zipNotificationMessage"),
    `${zipCount} ${t("folderDropzone.zipNotificationTitle")}`
  );
};

class FolderDropzone extends React.Component {
  constructor(props) {
    super(props);

    this.style_dropzone = {
      border: "0.2em dashed #868686",
      borderRadius: "3em"
    };

    this.style_placeholder = {
      fontSize: "3em"
    };
    this.handleDrop = this.handleDrop.bind(this);
  }

  handleDragover(event) {
    event.preventDefault();
  }

  loadFileOrFolder(loadedPath) {
    this.props.setLoadedPath(loadedPath);
    const { api, computeHashes, t } = this.props;

    const hook = a => {
      api.loading_state.setStatus(a.status);
      if (a.count) {
        api.loading_state.setCount(a.count);
      }
      if (a.totalCount) {
        api.loading_state.setTotalCount(a.totalCount);
      }
    };

    api.loading_state.startToLoadFiles();
    AsyncHandleDrop(hook, loadedPath)
      .then(virtualFileSystem => {
        api.database.set(virtualFileSystem);
        api.loading_state.finishedToLoadFiles();
        api.undo.commit();
        return virtualFileSystem;
      })
      .then(async virtualFileSystem => {
        if (!isJsonFile(loadedPath)) {
          const filesAndFolders = virtualFileSystem.files_and_folders;
          const paths = getFiles(
            filesAndFoldersMapToArray(filesAndFolders)
          ).map(file => file.id);
          addTracker({
            type: ActionType.TRACK_EVENT,
            title: ActionTitle.FILE_TREE_DROP,
            value: `Files dropped: ${paths.length}`
          });
          const zipFileCount = countZipFiles(paths);
          if (zipFileCount > 0) {
            displayZipNotification(zipFileCount, t);
          }

          // We defer the thunk execution to wait for the real estate setters to complete
          // TODO: Remove this once real estate setters are no longer used
          await wait();

          computeHashes(virtualFileSystem.original_path);
        }
      })
      .catch(error => {
        console.error(error);
        api.loading_state.errorLoadingFiles();
      });
  }
  handleDrop(event) {
    event.preventDefault();
    const { t } = this.props;

    const isFileDefined = expectToBeDefined(event.dataTransfer.files[0]);

    if (!isFileDefined) {
      notifyError(
        t("folderDropzone.loadingErrorMessage"),
        t("folderDropzone.loadingErrorTitle")
      );
      return;
    }

    this.loadFileOrFolder(event.dataTransfer.files[0].path);
  }

  componentDidMount() {
    if (AUTOLOAD !== "") {
      this.loadFileOrFolder(path.resolve(AUTOLOAD));
    }
  }

  render() {
    const { t } = this.props;
    return (
      <div
        className="grid-y grid-frame align-center"
        onDragOver={this.handleDragover}
        onDrop={this.handleDrop}
        style={this.style_dropzone}
      >
        <div className="cell">
          <TextAlignCenter>
            <div id="drag-drop-text" style={this.style_placeholder}>
              {t("folderDropzone.placeholder")}
            </div>
          </TextAlignCenter>
        </div>
        <div className="cell">
          <TextAlignCenter>
            <div>{t("folderDropzone.placeholderSubtitle")}</div>
          </TextAlignCenter>
        </div>
        <div className="cell">
          <TextAlignCenter>
            <div>
              <em>
                <br />
                {t("folderDropzone.disclaimer")}
                <br />
                {t("folderDropzone.disclaimerSubtitle")}
              </em>
            </div>
          </TextAlignCenter>
        </div>
      </div>
    );
  }
}

export default withTranslation()(FolderDropzone);
