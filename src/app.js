// Enables reporter to hook into the environment so it captures uncaught errors
import "./reporter";

import "foundation-sites";
import "./css/index.scss";
import "css/app.css";

import { SecretDevtools } from "secret-devtools";

import React from "react";

import ReactDOM from "react-dom";
import Analytics from "electron-ga";

import ErrorBoundary from "components/error-boundary";
import MainSpace from "components/main-space";
import Header from "components/header";
import ANewVersionIsAvailable from "components/a-new-version-is-available";

import WindowResize from "components/window-resize";

import { Store } from "reducers/real-estate-store";
import { Provider } from "react-redux";
import store from "reducers/store.ts";

import version from "version";
import pick from "languages";

import { NotificationContainer } from "react-notifications";

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
  const rootDiv = document.createElement("div");
  rootDiv.setAttribute("id", "root");

  if (document.body !== null) {
    document.body.appendChild(rootDiv);
  }

  ReactDOM.render(
    <Provider store={store}>
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
              <NotificationContainer />
            </ErrorBoundary>
          );
        }}
      </Store>
    </Provider>,
    rootDiv
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
