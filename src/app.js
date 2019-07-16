import "foundation-sites";
import "./css/index.scss";
import "./css/app.css";

import { SecretDevtools } from "secret-devtools";

import React from "react";

import ReactDOM from "react-dom";
import Analytics from "electron-ga";

import ErrorBoundary from "components/error-boundary";
import MainSpace from "components/main-space";
import Header from "components/header";
import ANewVersionIsAvailable from "components/a-new-version-is-available";

import WindowResize from "components/window-resize";

import "css/app.css";

import { Store } from "reducers/store";

import version from "version";
import pick from "languages";

SecretDevtools.enable();

document.title = pick({
  en: "Archifiltre v" + version,
  fr: "Archifiltre v" + version
});

if (MODE === "production") {
  const analytics = new Analytics("UA-115293619-2");

  analytics.send("pageview", {
    dh: "https://archifiltre.electron/",
    dp: "/electron/v9",
    dt: "archifiltre"
  });
}

/**This is the entrypoint for the app. */
const app = () => {
  let root_div = document.createElement("div");
  root_div.setAttribute("id", "root");

  if (document.body !== null) {
    document.body.appendChild(root_div);
  }

  ReactDOM.render(
    <Store>
      {props => {
        const api = props.api;
        return (
          <ErrorBoundary api={api}>
            <WindowResize />
            <div className="grid-y grid-frame">
              <div className="cell">
                <ANewVersionIsAvailable />
              </div>
              <div className="cell">
                <Header api={api} />
              </div>
              <div className="cell auto">
                <MainSpace api={api} />
              </div>
            </div>
          </ErrorBoundary>
        );
      }}
    </Store>,
    root_div
  );
};

window.addEventListener("load", app);

document.ondragover = document.ondrop = ev => {
  ev.preventDefault();
  return false;
};

window.ondragover = window.ondrop = ev => {
  ev.preventDefault();
  return false;
};
