import React from "react";

import TextAlignCenter from "components/common/text-align-center";

import path from "path";

import { expectToBeDefined } from "../../util/expect-behaviour";
import { notifyError } from "../../util/notifications-util";
import { withTranslation } from "react-i18next";

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
    this.loadFromPath = this.loadFromPath.bind(this);
  }

  handleDragover(event) {
    event.preventDefault();
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

    this.loadFromPath(event.dataTransfer.files[0].path);
  }

  loadFromPath(loadedPath) {
    const { loadFromPath, api, setLoadedPath } = this.props;
    setLoadedPath(loadedPath);
    loadFromPath(loadedPath, { api });
  }

  componentDidMount() {
    if (AUTOLOAD !== "") {
      const loadedPath = path.resolve(AUTOLOAD);
      this.loadFromPath(loadedPath);
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
