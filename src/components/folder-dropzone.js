import React from "react";

import AsyncHandleDrop from "async-handle-drop";

import TextAlignCenter from "components/text-align-center";

import pick from "languages";
import path from "path";
import {
  computeFolderHashes$,
  computeHashes$
} from "../hash-computer/hash-computer.controller";
import {
  filesAndFoldersMapToArray,
  getFiles
} from "../util/file-and-folders-utils";

const placeholder = pick({
  en: "Drop a directory here!",
  fr: "Glissez-déposez un répertoire ici !"
});

const placeholder_st = pick({
  en: "You may also drop a JSON file previously exported from Archifiltre.",
  fr:
    "Vous pouvez aussi déposer un fichier JSON précédement exporté depuis Archifiltre."
});

const disclaimer = pick({
  en: (
    <em>
      <br />
      {"Compatible with Firefox and Chrome."}
      <br />
      {
        "Your data won't leave your computer. Only you can see what happens in this app."
      }
    </em>
  ),
  fr: (
    <em>
      <br />
      Compatible avec Firefox et Chrome.
      <br />
      Vos données ne quittent pas votre ordinateur ; seul•e vous pouvez voir ce
      qui se passe dans cette application.
    </em>
  )
});

export default class FolderDropzone extends React.Component {
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

  handleDragover(e) {
    e.preventDefault();
  }

  handleDrop(e) {
    e.preventDefault();

    const {
      props: { api }
    } = this;

    const hook = a => {
      api.loading_state.setStatus(a.status);
      if (a.count) {
        api.loading_state.setCount(a.count);
      }
      if (a.totalCount) {
        api.loading_state.setTotalCount(a.totalCount);
      }
    };

    this.props.api.loading_state.startToLoadFiles();
    AsyncHandleDrop(hook, e.dataTransfer.files[0].path)
      .then(vfs => {
        api.database.set(vfs);
        api.loading_state.finishedToLoadFiles();
        api.undo.commit();
        return vfs;
      })
      .then(vfs => {
        const filesAndFolders = vfs.files_and_folders.toJS();
        const basePath = vfs.original_path
          .split(path.sep)
          .slice(0, -1)
          .join(path.sep);
        const paths = getFiles(filesAndFoldersMapToArray(filesAndFolders)).map(
          file => file.id
        );
        computeHashes$(paths, {
          initialValues: { basePath }
        }).subscribe({
          next: api.database.setHashes,
          complete: () =>
            setTimeout(() =>
              computeFolderHashes$(api.database.getData()).subscribe(
                api.database.setHashes
              )
            )
        });
      })
      .catch(err => {
        console.error(err);
        api.loading_state.errorLoadingFiles();
      });
  }

  render() {
    return (
      <div
        className="grid-y grid-frame align-center"
        onDragOver={this.handleDragover}
        onDrop={this.handleDrop}
        style={this.style_dropzone}
      >
        <div className="cell">
          <TextAlignCenter>
            <div style={this.style_placeholder}>{placeholder}</div>
          </TextAlignCenter>
        </div>
        <div className="cell">
          <TextAlignCenter>
            <div>{placeholder_st}</div>
          </TextAlignCenter>
        </div>
        <div className="cell">
          <TextAlignCenter>
            <div>{disclaimer}</div>
          </TextAlignCenter>
        </div>
      </div>
    );
  }
}
